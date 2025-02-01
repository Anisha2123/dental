exports.pdf_invoice = (req) => {
    //// console.log(req,"reqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    //// console.log(req,+req.trans.cgst,+req.trans.sgst,+req.updateRespo.finalPrice,req.updateRespo.appliedCoupon,typeof req.updateRespo.appliedCoupon, req.updateRespo.appliedCoupon);
    let mailcontent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      thead tr
      {
          background:#eee!important;
      }
      thead tr th
      {
        background: #eee;
        font-size: 18px
      }
      h5,h6
      {
        font-weight: bold;
        font-size: 20px;
        margin-top:2px!important;
        margin-bottom: 2px!important;
        padding-left: 5px;
  
      }
      p,span,td
      {
        font-size:18px;
        margin-top:2px!important;
        margin-bottom: 2px!important;
        padding-left: 5px;
      }
    </style>
    </head>
    <body style="padding:20px;">
    <header class="clearfix" style="content: ''; clear: both;">
      <div id="logo" style="float: left; margin-top: 8px;">
      <img src="https://digitalpehchan.in/assets/images/PNG-01-1 1.png" style="width: 200px; height: 100px" />
      </div>
      <div id="company" style="float: right; text-align: right; margin-bottom:30px">
        <h2 class="name" style="color:#5840bb;"> Invoice </h2>
        <h6 class="name"  >Digital Pehchan India PVT. LTD.</h6>
        <div>Mhow, Indore (m.p) <br/>
        +91 79999 94187 | digitalpehchanindia@gmail.com<br/>
        </div>
        <div>GST No. ___________________</div>
      </div>
    </header>
    <br>
    <main>
    <br>
      <table border="1" cellspacing="0" cellpadding="0" style="width: 100%">
        <tbody style="width: 100%">
          <tr style=" width: 33.33%">
            <td rowspan="3">
              <h5>Billed To <br> ${req.user.firstname} ${req.user.lastname}</h5>
              <span>${req.user.mobile}</span><br>
              <span>${(req.user.email) ? req.user.email: '' }</span>
            </td>
            <td style="text-align: center;">
                <h5> Order ID </h5> ${(req.paymentDocument.order_id) ? req.paymentDocument.order_id: req.order_id}
              </td>
              <td rowspan="3" style="text-align: center;">
                Total Amount <h5 style= "color:#5840bb;"> ₹ ${req.getPricingPlan.pricing_amount}</h5>
              </td>
          </tr>
          <tr style=" width: 33.33%">
            <td style="text-align: center;">
              <h5>  Transaction ID </h5>${(req.trans.razorpay_payment_id) ? req.trans.razorpay_payment_id: req.transaction_id}
              </td>
          </tr>
          <tr style=" width: 33.33%">
            <td style="text-align: center;">
              <h5> Date of Subscription</h5> ${req.pay_time}
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <table border="1" cellspacing="0" cellpadding="0" style="width: 100%">
        <thead style="width: 100%">
          <tr style="color:#5840bb; width: 20%">
            <th class="no">S.No.</th>
            <th class="desc">Description</th>
            <th class="unit">Price</th>
          </tr>
        </thead>
        <tbody style="width: 100%">
          <tr style="width: 20%">
            <td class="no">01</td>
            <td class="desc" style="font-weight: bold"> ${req.getPricingPlan.plan_name} Subscription - 
              For ${req.getPricingPlan.plan_days} Days
            </td>
            <td class="unit">
              ₹ ${(req.getPricingPlan.pricing_amount / (1.18)).toFixed(2)}
              `
              mailcontent+=`
            </td>
          </tr>
        </tbody>
        <tfoot style="width:100%">
          `;
          mailcontent+= `
          <tr style="width:20%">
            <td></td>
            <td>CGST @ 9% </td>
            <td>₹ ${(9*0.01*(+req.getPricingPlan?.pricing_amount / (1.18))).toFixed(2)}</td>
          </tr>
          <tr style="width:20%">
            <td></td>
            <td>SGST @ 9%</td>
            <td>₹ ${(9*0.01*(+req.getPricingPlan?.pricing_amount / (1.18))).toFixed(2)}</td>
          </tr>`;
          mailcontent+= `<tr style="width:20%">
            <td></td>
            <td  style="font-weight: bold">Grand Total</td>
            <td style="font-weight: bold">₹ ${+req.getPricingPlan?.pricing_amount}</td>
          </tr>
        </tfoot>
      </table>
      <br>
      <br />
      <div id="thanks" style="text-align: center;">Thank you!</div>
      <br />
      <div id="notices">
        <div>TERMS & CONDITIONS:</div>
        <div class="notice">
          1. All disputes are subjected to Indore Jurisdiction only. <br>
          2. We reserve the right to change the prices at any point of time. <br>
          3. No cancellation and refunds are provided for Pehchan card once created. <br>   
          4. We reserve the right to deactivate your access to the services 
          for the failure to pay renewal charges after the expiry of primary subscription.     
        </div>
      </div>
    </main>
  </body>
  </html>`;
    return mailcontent;
  }