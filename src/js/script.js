paypal
  .Buttons({
    style: {
      layout: "vertical",
      color: "blue",
      shape: "rect",
      label: "paypal",
      tagline: false,
    },
    fundingSource: paypal.FUNDING.PAYPAL,
    createOrder: function () {
      return fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: 1,
              quantity: 2,
            },
            { id: 2, quantity: 3 },
          ],
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          return res.json().then((json) => Promise.reject(json));
        })
        .then(({ id }) => {
          return id;
        })
        .catch((e) => {
          console.error(e.error);
        });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        document.getElementById("check-out-form").submit();
      });
    },
  })
  .render("#paypal");
