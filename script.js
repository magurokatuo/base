document.addEventListener('DOMContentLoaded', () => {
    console.log("スコアブックのスクリプトが読み込まれ、初期化処理を開始します。");

    // --- DOM要素の取得 ---
    const visitorTeamInput = document.getElementById('visitor-team-name');
    const homeTeamInput = document.getElementById('home-team-name');
    const visitorBody = document.getElementById('visitor-body');
    const homeBody = document.getElementById('home-body');
    const rostersContainer = document.getElementById('rosters-container');
    const resetButton = document.getElementById('reset-button');

    const NUM_PLAYERS = 9;

    // --- スコアボード描画機能 ---
    const renderScoreboard = () => {
        [visitorBody, homeBody].forEach(body => {
            body.innerHTML = ''; // 既存の行をクリア
            for (let i = 0; i < NUM_PLAYERS; i++) {
                const playerRow = document.createElement('tr');
                let cells = `<td class="player-name"></td>`;
                for (let j = 0; j < 9; j++) { // 9イニング分のセル
                    cells += `<td class="inning-cell"><div class="inning-box"></div></td>`;
                }
                playerRow.innerHTML = cells;
                body.appendChild(playerRow);
            }
            // 合計行を追加
            const totalRow = document.createElement('tr');
            totalRow.innerHTML = `
                <td class="total-label">合計</td>
                <td colspan="9"></td>
                <td class="total-runs">0</td>`;
            body.appendChild(totalRow);
        });
    };

    // --- 状態保存機能 ---
    const saveState = () => {
        const visitorRoster = Array.from(document.querySelectorAll('#visitor-roster input[type="text"]')).map(input => input.value);
        const homeRoster = Array.from(document.querySelectorAll('#home-roster input[type="text"]')).map(input => input.value);

        const state = {
            visitorTeamName: visitorTeamInput.value,
            homeTeamName: homeTeamInput.value,
            visitorRoster: visitorRoster,
            homeRoster: homeRoster,
            // スコアデータは次のステップで追加
        };
        localStorage.setItem('baseballScoreboardState', JSON.stringify(state));
    };

    // --- 状態復元機能 ---
    const loadState = () => {
        renderScoreboard(); // まずボードを描画
        const savedState = localStorage.getItem('baseballScoreboardState');
        if (!savedState) return;

        const state = JSON.parse(savedState);

        visitorTeamInput.value = state.visitorTeamName;
        homeTeamInput.value = state.homeTeamName;

        const visitorRosterInputs = document.querySelectorAll('#visitor-roster input[type="text"]');
        if (state.visitorRoster) {
            const player_names = document.querySelectorAll('#visitor-body .player-name');
            state.visitorRoster.forEach((name, index) => {
                if (visitorRosterInputs[index]) visitorRosterInputs[index].value = name;
                if (player_names[index]) player_names[index].textContent = name;
            });
        }

        const homeRosterInputs = document.querySelectorAll('#home-roster input[type="text"]');
        if (state.homeRoster) {
            const player_names = document.querySelectorAll('#home-body .player-name');
            state.homeRoster.forEach((name, index) => {
                if (homeRosterInputs[index]) homeRosterInputs[index].value = name;
                if (player_names[index]) player_names[index].textContent = name;
            });
        }
        // 合計点の復元は次のステップで
    };

    // --- リセット機能 ---
    const resetBoard = () => {
        localStorage.removeItem('baseballScoreboardState');
        visitorTeamInput.value = '';
        homeTeamInput.value = '';
        document.querySelectorAll('#rosters-container input[type="text"]').forEach(input => input.value = '');
        loadState(); // 空の状態で再描画・初期化
    };

    // --- イベントリスナー ---
    visitorTeamInput.addEventListener('input', saveState);
    homeTeamInput.addEventListener('input', saveState);
    rostersContainer.addEventListener('input', () => {
        saveState();
        loadState(); // 名簿の変更をスコアボードに即時反映
    });
    resetButton.addEventListener('click', resetBoard);

    // --- 初期読込 ---
    loadState();
});
