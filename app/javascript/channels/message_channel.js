import consumer from "channels/consumer"

const messageChannel = consumer.subscriptions.create("MessageChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    const messageDisplay = document.querySelector('#message-display')
    messageDisplay.insertAdjacentHTML('beforeend', this.template(data))

    // Scroll to the last message
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
    
    // Clear the input field only for sender
    const senderEmail = document.querySelector('#message-input').getAttribute('data-current-email')
    if (data.user.email == senderEmail) {
      document.querySelector('#message-input').value = ''
    }
  },

  template(data) {
    return `<article class="message">
              <div class="message-header">
                <p>${data.user.email}</p>
              </div>
              <div class="message-body">
                <p>${data.body}</p>
              </div>
            </article>`
  }
});

  // Scroll to the last message when the page loads
  window.addEventListener("load", function() {
    var messageDisplay = document.getElementById("message-display");
    // scrollTop means the distance from the top of the element to the top of the visible area
    // scrollHeight means the height of the element's content, including content not visible on the screen due to overflow
    // So, when the page loads, we set the scrollTop to the scrollHeight, which means we scroll to the bottom of the element
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
  });

// Directly send user input to the channel

// document.addEventListener("turbo:load", () => {
//   let form = document.querySelector('#message-form')
//   if(form) {
//     form.addEventListener('submit', (e) => {
//       e.preventDefault()
//       let messageInput = document.querySelector('#message-input').value
//       if(messageInput == '') return;
//       const message = {
//         body: messageInput
//       }
//       messageChannel.send({message: message})
//       document.querySelector('#message-input').value = '' // Clear the input
//     })
//   }
// })