

export default async function decorate(block) {
  const aempublishurl = 'https://publish-p130407-e1279066.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p130407-e1279066.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/aldi-rug/recipe2ByPath';
  const recipepath = block.querySelector(':scope div:nth-child(1) > div a').innerHTML.trim();
  const variationname = block.querySelector(':scope div:nth-child(2) > div').innerHTML.trim();

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};path=${recipepath};variation=${variationname};ts=${Math.random() * 1000}`
    : `${aempublishurl}${persistedquery};path=${recipepath};variation=${variationname};ts=${Math.random() * 1000}`;
  const options = { credentials: 'include' };


  



  /*
  const cfReq = await fetch(url,options)
    .then((response) => response.json())
    .then((contentfragment) => {
      let offer = '';
      if (contentfragment.data) {
        offer = contentfragment.data.recipe2ByPath.item;
      }
      return offer;
    });
*/

  
const cfReq = await fetch(url, options)
  .then((response) => response.json())
  .then((data) => data?.data?.recipe2ByPath?.item || {});
  

  const itemId = `urn:aemconnection:${recipepath}/jcr:content/data/master`;




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
          <p data-aue-prop="pretitle" data-aue-label="recipeDirections" data-aue-type="text" class='headline'>${cfReq.recipeDirections.plaintext}</p>
          <p data-aue-prop="detail" data-aue-label="detail" data-aue-type="richtext" class='detail'>${cfReq.recipeDescription.plaintext}</p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

}



