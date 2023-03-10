# Action Cable Demo

This demo demonstrates how Action Cable can be used to enhance an application to give it real time features and is based on [this lesson](https://github.com/TheOdinProject/curriculum/blob/main/ruby_on_rails/mailers_advanced_topics/actioncable_lesson.md).

## Thoughts and Suggestions
I ran through the lesson and had a few ideas that might improve the experience for other students.

Firstly, I thought it would be best to remove the duplicate ID on two elements (a div and a form) in the index HTML. On a related note, the suggested styling on `app/assets/stylesheets/hangouts.scss` can be changed so that the message input can expand to the full width of the container like the message display div. That would require selecting the right elements and not just the input. It could also be explained why the styling is being done in a stylesheet that wasn't mentioned before, and it may be proper to include an `import` statement on `application.scss`. 

The lesson also mentioned changing `application.css` to `application.scss` after installing `bulma-rails` as an easier method than others; it would be nice to know what a less expedient but more proper approach would be to set it up. The ways I could think of were either adding the `cssbundling-rails` gem or using a `--css` flag when setting up a new Rails project. The benefit to this would be to have foreman watch changes to stylesheets so students can play around with Bulma with greater ease (I understand that isn't the main focus, but it may be good practice to build toy/demo projects this way).

Seeing a potential N+1 query problem "in the wild" was great. In a similar spirit, I felt that other students might benefit from an explanation of why the the `hangouts#create` action was implemented as it was. Perhaps using an `if @message.save` conditional and including either a `render` or `head` statement would help improve understanding of why the server returns a 204 (No Content) status. 

#### Possible Implementation
```rb
# app/controllers/messages_controller.rb

class MessagesController < ApplicationController
  def create
    @message = current_user.messages.build(message_params)
    respond_to do |format|
      if @message.save
        ActionCable.server.broadcast('message', @message.as_json(include: :user))
        format.turbo_stream { head :ok }
      else
        format.turbo_stream { head :unprocessable_entity }
      end
    end
  
  ...

end
```

A few quality of life tweaks to the client-side JavaScript to clear the input on submission and scrolling to the bottom of the messages in the display div on page load as well as when messages are sent/received would enhance the experience of putting together this neat messaging app. 

_NOTE: In the implementation below, I created a Stimulus controller to clear the input field on submission. You may want to review the markup in `apps/views/hangouts/index.html.erb` where the `data-controller`, `data-action`, and `data-message-target` attributes are being added to the form. The `turbo:submit-end` event is necessary because relying on the `submit` or `click` events will clear the input before the message is sent to the server. Notice that, because messages are being persisted, the stimulus controller scrolls to the bottom of the message display on page load. From there, the scrolling is handled by the `received` method in the client-side `message_channel.js`._


#### Possible Implementation
```js
// app/javascript/controllers/message_controller.js

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "input", "display" ]

  connect() {
    console.log("Hello, Stimulus!", this.inputTarget)
    this.scrollToBottom()
  }

  clearInput() {
    this.inputTarget.value = ''
  }

  scrollToBottom() {
    this.displayTarget.scrollTop = this.displayTarget.scrollHeight;
  }
}

```

```js
// app/javascript/channels/message_channel.js

const messageChannel = consumer.subscriptions.create("MessageChannel", {
  
  ... 

  received(data) {
    const messageDisplay = document.querySelector('#message-display')
    messageDisplay.insertAdjacentHTML('beforeend', this.template(data))

    // Scroll to the last message
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
  },
  ...

});
```
