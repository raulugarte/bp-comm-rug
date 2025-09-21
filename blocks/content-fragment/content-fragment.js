/* RUG - Original Code */
/*

import { getMetadata } from '../../scripts/aem.js';
import { isAuthorEnvironment, moveInstrumentation } from '../../scripts/scripts.js';

/**
 *
 //* @param {Element} block
 *




export default async function decorate(block) {
	// Configuration
  const CONFIG = {
    WRAPPER_SERVICE_URL: 'https://prod-31.westus.logic.azure.com:443/workflows/2660b7afa9524acbae379074ae38501e/triggers/manual/paths/invoke',
    WRAPPER_SERVICE_PARAMS: 'api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kfcQD5S7ovej9RHdGZFVfgvA-eEqNlb6r_ukuByZ64o',
		/* RUG 
    // GRAPHQL_QUERY: '/graphql/execute.json/wknd-universal/CTAByPath',
		



		GRAPHQL_QUERY: '/graphql/execute.json/aldi-rug/recipe2ByPath',
    EXCLUDED_THEME_KEYS: new Set(['brandSite', 'brandLogo'])
  };
	
	const hostname = getMetadata('hostname');	
  const aemauthorurl = getMetadata('authorurl') || '';
	
  const aempublishurl = hostname?.replace('author', 'publish')?.replace(/\/$/, '');  
	
	//const aempublishurl = getMetadata('publishurl') || '';
	
  /* RUG 
	// const persistedquery = '/graphql/execute.json/wknd-universal/CTAByPath';
 	
	const persistedquery = '/graphql/execute.json/aldi-rug/recipe2ByPath';
	
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
        //let offer;
        //try {
       //   offer = await response.json();
			//

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
        //const cfReq = offer?.data?.ctaByPath?.item;
					
				const cfReq = recipecf?.data?.recipe2ByPath?.item;

        if (!cfReq) {
          console.error('Error parsing response from GraphQL request - no valid data found', {
						/* RUG
            //response: offer,

			
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

	//
 // if (!isAuthor) {
   // moveInstrumentation(block, null);
  //  block.querySelectorAll('*').forEach((elem) => moveInstrumentation(elem, null));
 // }
	
//}


*/




export default async function decorate(block) {
  const aempublishurl = 'https://publish-p130407-e1279066.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p130407-e1279066.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/aldi-rug/recipe2ByPath';
  const offerpath = block.querySelector(':scope div:nth-child(1) > div a').innerHTML.trim();
  const variationname = block.querySelector(':scope div:nth-child(2) > div').innerHTML.trim();

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`
    : `${aempublishurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`;
  const options = { credentials: 'include' };


  



  
  const cfReq = await fetch(url, options)
    .then((response) => response.json())
    .then((contentfragment) => {
      let offer = '';
      if (contentfragment.data) {
        offer = contentfragment.data.recipe2ByPath.item;
      }
      return offer;
    });

  const itemId = `urn:aemconnection:${offerpath}/jcr:content/data/master`;


  /* RUG 
  
  block.innerHTML = `
  <div class='banner-content' data-aue-resource=${itemId} data-aue-label="offer content fragment" data-aue-type="reference" data-aue-filter="cf">
      <div data-aue-prop="heroImage" data-aue-label="hero image" data-aue-type="media" class='banner-detail' style="background-image: linear-gradient(90deg,rgba(0,0,0,0.6), rgba(0,0,0,0.1) 80%) ,url(${aempublishurl + cfReq.heroImage._dynamicUrl});">
          <p data-aue-prop="headline" data-aue-label="headline" data-aue-type="text" class='pretitle'>${cfReq.headline}</p>
          <p data-aue-prop="pretitle" data-aue-label="pretitle" data-aue-type="text" class='headline'>${cfReq.pretitle}</p>
          <p data-aue-prop="detail" data-aue-label="detail" data-aue-type="richtext" class='detail'>${cfReq.detail.plaintext}</p>
      </div>
      <div class='banner-logo'>
      </div>
  </div>
`;
*/

  // Compose _dynamicUrl, assuming it exists
  const imageBase = aempublishurl + cfReq.recipeImage._dynamicUrl;

    block.innerHTML = `
<div class="section hero-container" data-section-status="loaded" style="">
  <div class="hero-wrapper">
    <div class="hero block" data-block-name="hero" data-block-status="loaded">
      <div>
        <div>
          <picture>
            <source type="image/webp" srcset="${imageBase}&width=2000&format=webp&optimize=medium" media="(min-width: 600px)">
            <source type="image/webp" srcset="${imageBase}&width=750&format=webp&optimize=medium">
            <source type="image/jpeg" srcset="${imageBase}&width=2000&format=jpg&optimize=medium" media="(min-width: 600px)">
            <img loading="eager" alt="XXXXX" src="${imageBase}&width=750&format=jpg&optimize=medium" width="2623" height="878">
          </picture>
        </div>
      </div>
      <div>
        <div class="default-content-wrapper">
          <h1 id="${cfReq.recipeTitle}">${cfReq.recipeTitle}</h1>
          <p data-aue-prop="headline" data-aue-label="headline" data-aue-type="text" class='pretitle'>${cfReq.recipeTitle}</p>
          <p data-aue-prop="pretitle" data-aue-label="recipeDirections" data-aue-type="text" class='headline'>${cfReq.recipeDirections}</p>
          <p data-aue-prop="detail" data-aue-label="detail" data-aue-type="richtext" class='detail'>${cfReq.detail.plaintext}</p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

}



