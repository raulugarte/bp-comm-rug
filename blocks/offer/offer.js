/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  const aempublishurl = 'https://publish-p130407-e1279066.adobeaemcloud.com';
  const aemauthorurl = 'https://author-p130407-e1279066.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/securbank/OfferByPath';
  const offerpath = block.querySelector(':scope div:nth-child(1) > div a').innerHTML.trim();
  const variationname = block.querySelector(':scope div:nth-child(2) > div').innerHTML.trim();

  const url = window.location && window.location.origin && window.location.origin.includes('author')
    ? `${aemauthorurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`
    : `${aempublishurl}${persistedquery};path=${offerpath};variation=${variationname};ts=${Math.random() * 1000}`;
  const options = { credentials: 'include' };


  
const cf = await fetch(url).then(res => res.json());
const item = cf.data.offerByPath.item;
const attributeNames = Object.keys(item);
console.log(attributeNames);


  
  const cfReq = await fetch(url, options)
    .then((response) => response.json())
    .then((contentfragment) => {
      let offer = '';
      if (contentfragment.data) {
        offer = contentfragment.data.offerByPath.item;
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
  const imageBase = aempublishurl + cfReq.heroImage._dynamicUrl;

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
          <h1 id="${cfReq.headline}">${cfReq.headline}</h1>
          <p data-aue-prop="headline" data-aue-label="headline" data-aue-type="text" class='pretitle'>${cfReq.headline}</p>
          <p data-aue-prop="pretitle" data-aue-label="pretitle" data-aue-type="text" class='headline'>${cfReq.pretitle}</p>
          <p data-aue-prop="detail" data-aue-label="detail" data-aue-type="richtext" class='detail'>${cfReq.detail.plaintext}</p>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

}
