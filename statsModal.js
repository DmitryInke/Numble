class StatsModal {
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    const [totalTries, successRate, currentStreak, bestStreak] = data;
    const markup = `
    <div><div style = "text-align: center;"><h3>Statistics</h3><div style="margin-top: 0.5rem"><div style = "justify-content: center; display: flex; margin-bottom: 0.5rem;
    margin-top: 0.5rem;"><div class="stats-item"><div class="stats-var">${totalTries}</div><div class="stats-text">Total tries</div></div><div class="stats-item"><div class="stats-var">${successRate}%</div><div class="stats-text">Success rate</div></div><div class="stats-item"><div class="stats-var">${currentStreak}</div><div class="stats-text">Current streak</div></div><div class="stats-item"><div class="stats-var">${bestStreak}</div><div class="stats-text">Best streak</div></div></div></div></div></div>`;
    let parentElement = document.getElementById('stats-modal');
    parentElement.innerHTML = '';
    parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
export default new StatsModal();
