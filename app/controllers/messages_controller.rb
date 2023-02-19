class MessagesController < ApplicationController
  def create
    @message = current_user.messages.build(message_params)
    @message.save

    respond_to do |format|
      if @message.save
        # A json object needed to send data to the client through the websocket server
        # The user is included in the json object to display the user's name
        ActionCable.server.broadcast('message', @message.as_json(include: :user))
        format.turbo_stream { head :ok }
      else
        format.turbo_stream { head :unprocessable_entity }
      end
    end
  end

  private

  def message_params
    params.require(:message).permit(:body)
  end
end
