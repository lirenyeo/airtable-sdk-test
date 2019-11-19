function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault()
      console.log('scrolling!')
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      })
    })
  })
}

function generateCard(name, description, imageUrl, price) {
  return `
  <div class="col-md-4">
    <div class="card mb-4 shadow-sm">
      <img class="bd-placeholder-img card-img-top" width="100%" height="225" src="${imageUrl}">
      <div class="card-body">
        <strong class="card-text">${name}</strong>
        <p class="card-text">${description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <a id="buy-btn" href="#form-container" class="btn btn-sm btn-outline-secondary">BUY NOW</a>
          </div>
          <small class="text-main">RM${price}</small>
        </div>
      </div>
    </div>
  </div>
  `
}

const productContainer = document.getElementById('product-container')

productContainer.innerHTML = `<div class="mx-auto lds-css ng-scope"><div style="width:100%;height:100%" class="lds-facebook"><div></div><div></div><div></div></div></div>`

var Airtable = require('airtable')
var base = new Airtable({ apiKey: 'key23F8r22FJ7DNvk' }).base(
  'appNo7KHnVGi4EsXv'
)

base('Products')
  .select({
    // Selecting the first 3 records in Product Grid:
    // maxRecords: 3,
    view: 'Product Grid'
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      let htmlContent = ''
      records.forEach(function(record) {
        let imgUrl
        if (record.get('Picture')) {
          imgUrl = record.get('Picture')[0].url
        } else {
          imgUrl = 'https://picsum.photos/200'
        }
        htmlContent += generateCard(
          record.get('Product'),
          record.get('Description'),
          imgUrl,
          record.get('Price')
        )
      })

      productContainer.innerHTML = htmlContent
      initSmoothScroll()

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage()
    },
    function done(err) {
      if (err) {
        console.error(err)
        return
      }
    }
  )
