Rails.application.routes.draw do
  root "hangouts#index"
  devise_for :users
end
