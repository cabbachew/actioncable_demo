import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="message"
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
