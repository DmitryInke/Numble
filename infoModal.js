class InfoModal {
  render() {
    const markup = `          <div style="text-align: center">
    <h3>How to play</h3>
    <div style="margin-top: 0.5rem">
      <p class="text-how-play">
        You get 6 tries to guess the hidden equation! You get one hint,
        the value! All your guesses need to equate to the value to be
        accepted.
      </p>
      <div class="infos-div-modal">
        <div
          class="info-style"
          style="border-color: green; background-color: green"
        >
          2
        </div>
        <div class="info-style">+</div>
        <div class="info-style">3</div>
        <div class="info-style">-</div>
        <div class="info-style">0</div>
        <div class="info-style">*</div>
        <div class="info-style">1</div>
      </div>
      <p class="text-how-play">The number 2 is in the correct place!</p>
      <div class="infos-div-modal">
        <div class="info-style">3</div>
        <div class="info-style">*</div>
        <div class="info-style">2</div>
        <div class="info-style">/</div>
        <div class="info-style">1</div>
        <div
          class="info-style"
          style="background-color: yellow; border-color: yellow"
        >
          +
        </div>
        <div class="info-style">0</div>
      </div>
      <p class="text-how-play">
        The addition sign "+" exists in the equation but in a different
        place.
      </p>
      <div class="infos-div-modal">
        <div
          class="info-style"
          style="border-color: green; background-color: green"
        >
          2
        </div>
        <div
          class="info-style"
          style="border-color: green; background-color: green"
        >
          *
        </div>
        <div
          class="info-style"
          style="border-color: green; background-color: green"
        >
          2
        </div>
        <div
          class="info-style"
          style="border-color: green; background-color: green"
        >
          -
        </div>
        <div
          class="info-style"
          style="border-color: green; background-color: green"
        >
          1
        </div>
        <div class="info-style">/</div>
        <div
          class="info-style"
          style="border-color: green; background-color: green"
        >
          1
        </div>
      </div>
      <p class="text-how-play">
        The division sign "/" does not exist in the equation.
      </p>
    </div>
    </div>`;
    let parentElement = document.getElementById('info-modal');
    parentElement.innerHTML = '';
    parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
export default new InfoModal();
