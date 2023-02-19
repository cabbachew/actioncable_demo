class HangoutsController < ApplicationController
  def index
    @message = Message.new
    # Circumvent N+1 query problem
      # .all is not necessary because .each is called on @messages in the view
    @messages = Message.includes(:user)
  end
end
