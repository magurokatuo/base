document.addEventListener('DOMContentLoaded', () => {
    console.log("スコアブックのスクリプトが読み込まれ、初期化処理を開始します。");

    // --- DOM要素の取得 ---
    const visitorTeamInput = document.getElementById('visitor-team-name');
    const homeTeamInput = document.getElementById('home-team-name');
    const visitorBody = document.getElementById('visitor-body');
    const homeBody = document.getElementById('home-body');
    const rostersContainer = document.getElementById('rosters-container');
    const resetButton = document.getElementById('reset-button');
    const scoreboard = document.getElementById('scoreboard');

    const NUM_PLAYERS = 9;
    const NUM_INNINGS = 9;

    // --- スコアボード描画機能 ---
    const renderScoreboard = (state) => {
        [visitorBody, homeBody].forEach((body, teamIndex) => {
            body.innerHTML = ''; // 既存の行をクリア
            const teamType = teamIndex === 0 ? 'visitor' : 'home';

            for (let i = 0; i < NUM_PLAYERS; i++) {
                const playerRow = document.createElement('tr');
                let cells = `<td class="player-name">${state?.[`${teamType}Roster`]?.[i] || ''}</td>`;
                for (let j = 0; j < NUM_INNINGS; j++) {
                    const play = state?.[`${teamType}Plays`]?.[i]?.[j] || '';
                    cells += `<td class="inning-cell"><div class="inning-box">${play}</div></td>`;
                }
                playerRow.innerHTML = cells;
                body.appendChild(playerRow);
            }
            // 合計行を追加
            const totalRow = document.createElement('tr');
            totalRow.innerHTML = `
                <td class="total-label">合計</td>
                <td colspan="${NUM_INNINGS}"></td>
                <td class="total-runs">0</td>`;
            body.appendChild(totalRow);
        });
    };

    // --- 状態保存機能 ---
    const saveState = () => {
        const visitorRoster = Array.from(document.querySelectorAll('#visitor-roster input[type="text"]')).map(input => input.value);
        const homeRoster = Array.from(document.querySelectorAll('#home-roster input[type="text"]')).map(input => input.value);

        const getPlaysForTeam = (teamBody) => {
            const rows = Array.from(teamBody.querySelectorAll('tr:not(:last-child)'));
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('.inning-box'));
                return cells.map(cell => cell.textContent);
            });
        };

        const state = {
            visitorTeamName: visitorTeamInput.value,
            homeTeamName: homeTeamInput.value,
            visitorRoster: visitorRoster,
            homeRoster: homeRoster,
            visitorPlays: getPlaysForTeam(visitorBody),
            homePlays: getPlaysForTeam(homeBody),
        };
        localStorage.setItem('baseballScoreboardState', JSON.stringify(state));
    };

    // --- 状態復元機能 ---
    const loadState = () => {
        const savedState = localStorage.getItem('baseballScoreboardState');
        const state = savedState ? JSON.parse(savedState) : {};

        renderScoreboard(state); // ボードを描画

        visitorTeamInput.value = state.visitorTeamName || '';
        homeTeamInput.value = state.homeTeamName || '';

        const visitorRosterInputs = document.querySelectorAll('#visitor-roster input[type="text"]');
        if (state.visitorRoster) {
            state.visitorRoster.forEach((name, index) => {
                if (visitorRosterInputs[index]) visitorRosterInputs[index].value = name;
            });
        }

        const homeRosterInputs = document.querySelectorAll('#home-roster input[type="text"]');
        if (state.homeRoster) {
            state.homeRoster.forEach((name, index) => {
                if (homeRosterInputs[index]) homeRosterInputs[index].value = name;
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
    rostersContainer.addEventListener('input', (e) => {
        // To prevent lag, we only re-render and save, not reload the whole state
        const teamBody = e.target.closest('.roster-box').id.includes('visitor') ? visitorBody : homeBody;
        const index = Array.from(e.target.closest('ol').children).indexOf(e.target.parentElement);
        teamBody.querySelectorAll('.player-name')[index].textContent = e.target.value;
        saveState();
    });

    scoreboard.addEventListener('click', (e) => {
        if (e.target.classList.contains('inning-box')) {
            const currentPlay = e.target.textContent;
            const newPlay = prompt('打席結果を入力:', currentPlay);
            if (newPlay !== null) { // promptでキャンセルを押すとnullが返る
                e.target.textContent = newPlay;
                saveState();
            }
        }
    });

    resetButton.addEventListener('click', resetBoard);

    // --- 初期読込 ---
    loadState();
});
