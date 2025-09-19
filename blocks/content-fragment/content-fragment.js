import { getMetadata } from '../../scripts/aem.js';
import { isAuthorEnvironment, moveInstrumentation } from '../../scripts/scripts.js';

/**
 *
 * @param {Element} block
 */
export default async function decorate(block) {
	// Configuration
  const CONFIG = {
    WRAPPER_SERVICE_URL: 'https://prod-31.westus.logic.azure.com:443/workflows/2660b7afa9524acbae379074ae38501e/triggers/manual/paths/invoke',
    WRAPPER_SERVICE_PARAMS: 'api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kfcQD5S7ovej9RHdGZFVfgvA-eEqNlb6r_ukuByZ64o',
		/* RUG 
    GRAPHQL_QUERY: '/graphql/execute.json/wknd-universal/CTAByPath',
		*/
		GRAPHQL_QUERY: '/graphql/execute.json/aldi-rug/RecipeByPath',
    EXCLUDED_THEME_KEYS: new Set(['brandSite', 'brandLogo'])
  };
	
	const hostname = getMetadata('hostname');	
  const aemauthorurl = getMetadata('authorurl') || '';
	
  const aempublishurl = hostname?.replace('author', 'publish')?.replace(/\/$/, '');  
	
	//const aempublishurl = getMetadata('publishurl') || '';
	
  /* RUG 
	const persistedquery = '/graphql/execute.json/wknd-universal/CTAByPath';
 	*/
	const persistedquery = '/graphql/execute.json/aldi-rug/RecipeByPath';
	
  const contentPath = block.querySelector(':scope div:nth-child(1) > div a')?.textContent?.trim();
  const variationname = block.querySelector(':scope div:nth-child(2) > div')?.textContent?.trim()?.toLowerCase()?.replace(' ', '_') || 'master';
  block.innerHTML = '';
  const isAuthor = isAuthorEnvironment();

	// Prepare request configuration based on environment
	const requestConfig = isAuthor 
  ? {
      url: `${aemauthorurl}${CONFIG.GRAPHQL_QUERY};path=${contentPath};variation=${variationname};ts=${Date.now()}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  : {
      url: `${CONFIG.WRAPPER_SERVICE_URL}?${CONFIG.WRAPPER_SERVICE_PARAMS}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        graphQLPath: `${aempublishurl}${CONFIG.GRAPHQL_QUERY}`,
        cfPath: contentPath,
        variation: variationname
      })
    };

    try {
        // Fetch data
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method,
          headers: requestConfig.headers,
          ...(requestConfig.body && { body: requestConfig.body })
        });

        if (!response.ok) {
					console.error(`error making cf graphql request:${response.status}`, {
	          error: error.message,
	          stack: error.stack,
	          contentPath,
	          variationname,
	          isAuthor
        	});
          block.innerHTML = '';
          return; // Exit early if response is not ok
        } 

			/* RUG 
        let offer;
        try {
          offer = await response.json();
			*/

				let recipecf;
        try {
          recipecf = await response.json();
			
        } catch (parseError) {
					console.error('Error parsing recipecf JSON from response:', {
	          error: error.message,
	          stack: error.stack,
	          contentPath,
	          variationname,
	          isAuthor
        	});
          block.innerHTML = '';
          return;
        }

				/* RUG
        const cfReq = offer?.data?.ctaByPath?.item;
					*/
				const cfReq = recipecf?.data?.recipeCFByPath?.item;

        if (!cfReq) {
          console.error('Error parsing response from GraphQL request - no valid data found', {
						/* RUG
            response: offer,
						*/
						response: recipecf,
            contentPath,
            variationname
          });
          block.innerHTML = '';
          return; // Exit early if no valid data
        }
        // Set up block attributes
        const itemId = `urn:aemconnection:${contentPath}/jcr:content/data/${variationname}`;
        block.setAttribute('data-aue-type', 'container');
        const imgUrl = isAuthor ? cfReq.recipeImage?._authorUrl : cfReq.recipeImage?._publishUrl;

        block.innerHTML = `
        <div class='banner-content block' data-aue-resource=${itemId} data-aue-label="Recipe Content fragment" data-aue-type="reference" data-aue-filter="contentfragment">
          <div class='banner-detail' style="background-image: linear-gradient(90deg,rgba(0,0,0,0.6), rgba(0,0,0,0.1) 80%) ,url(${
            imgUrl
          });" data-aue-prop="bannerimage" data-aue-label="Main Image" data-aue-type="media" >
                <p data-aue-prop="cftitle" data-aue-label="Title" data-aue-type="text" class='cftitle'>${
                  cfReq?.recipeTitle
                }</p>
                <p data-aue-prop="cfsubtitle" data-aue-label="SubTitle" data-aue-type="text" class='cfsubtitle'>${
                cfReq?.recipeDirections?.plaintext
                }</p>
                
                <p data-aue-prop="cfdescription" data-aue-label="Description" data-aue-type="richtext" class='cfdescription'>${
                  cfReq?.description?.plaintext
                }</p>

            </div>
            <div class='banner-logo'>
            </div>
        </div>
        `;
        
    
      } catch (error) {
        console.error('Error rendering content fragment:', {
          error: error.message,
          stack: error.stack,
          contentPath,
          variationname,
          isAuthor
        });
        block.innerHTML = '';
      }

	/*
  if (!isAuthor) {
    moveInstrumentation(block, null);
    block.querySelectorAll('*').forEach((elem) => moveInstrumentation(elem, null));
  }
	*/
}
