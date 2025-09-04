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
            const manualRunValue = state?.[`${teamType}ManualRuns`] || 0;
            totalRow.innerHTML = `
                <td class="total-label">合計</td>
                <td colspan="${NUM_INNINGS}"></td>
                <td><input type="number" class="manual-runs" value="${manualRunValue}"></td>
                <td class="total-hits">0</td>
                <td class="total-errors">0</td>`;
            body.appendChild(totalRow);
        });
    };

    // --- H/E合計計算機能 ---
    const calculateAndDisplayTotals = () => {
        [visitorBody, homeBody].forEach(body => {
            let hits = 0;
            let errors = 0;
            const plays = Array.from(body.querySelectorAll('.inning-box')).map(box => box.textContent.toUpperCase());

            plays.forEach(play => {
                if (['1B', '2B', '3B', 'HR'].includes(play)) {
                    hits++;
                }
                if (play.startsWith('E')) {
                    errors++;
                }
            });
            body.querySelector('.total-hits').textContent = hits;
            body.querySelector('.total-errors').textContent = errors;
        });
    };

    // --- 状態保存機能 ---
    const saveState = () => {
        const getPlaysForTeam = (teamBody) => {
            const rows = Array.from(teamBody.querySelectorAll('tr:not(:last-child)'));
            return rows.map(row => Array.from(row.querySelectorAll('.inning-box')).map(cell => cell.textContent));
        };

        const state = {
            visitorTeamName: visitorTeamInput.value,
            homeTeamName: homeTeamInput.value,
            visitorRoster: Array.from(document.querySelectorAll('#visitor-roster input[type="text"]')).map(input => input.value),
            homeRoster: Array.from(document.querySelectorAll('#home-roster input[type="text"]')).map(input => input.value),
            visitorPlays: getPlaysForTeam(visitorBody),
            homePlays: getPlaysForTeam(homeBody),
            visitorManualRuns: visitorBody.querySelector('.manual-runs').value,
            homeManualRuns: homeBody.querySelector('.manual-runs').value,
        };
        localStorage.setItem('baseballScoreboardState', JSON.stringify(state));
    };

    // --- 状態復元機能 ---
    const loadState = () => {
        const savedState = localStorage.getItem('baseballScoreboardState');
        const state = savedState ? JSON.parse(savedState) : {};

        renderScoreboard(state);

        visitorTeamInput.value = state.visitorTeamName || '';
        homeTeamInput.value = state.homeTeamName || '';

        const visitorRosterInputs = document.querySelectorAll('#visitor-roster input[type="text"]');
        if (state.visitorRoster) {
            state.visitorRoster.forEach((name, index) => {
                if(visitorRosterInputs[index]) visitorRosterInputs[index].value = name;
            });
        }

        const homeRosterInputs = document.querySelectorAll('#home-roster input[type="text"]');
        if (state.homeRoster) {
            state.homeRoster.forEach((name, index) => {
                if(homeRosterInputs[index]) homeRosterInputs[index].value = name;
            });
        }

        calculateAndDisplayTotals();
    };

    // --- リセット機能 ---
    const resetBoard = () => {
        localStorage.removeItem('baseballScoreboardState');
        visitorTeamInput.value = '';
        homeTeamInput.value = '';
        document.querySelectorAll('#rosters-container input[type="text"]').forEach(input => input.value = '');
        loadState();
    };

    // --- イベントリスナー ---
    visitorTeamInput.addEventListener('input', saveState);
    homeTeamInput.addEventListener('input', saveState);
    rostersContainer.addEventListener('input', (e) => {
        const teamBody = e.target.closest('.roster-box').id.includes('visitor') ? visitorBody : homeBody;
        const index = Array.from(e.target.closest('ol').children).indexOf(e.target.parentElement);
        teamBody.querySelectorAll('.player-name')[index].textContent = e.target.value;
        saveState();
    });

    scoreboard.addEventListener('click', (e) => {
        if (e.target.classList.contains('inning-box')) {
            const currentPlay = e.target.textContent;
            const newPlay = prompt('打席結果を入力:', currentPlay);
            if (newPlay !== null) {
                e.target.textContent = newPlay;
                calculateAndDisplayTotals();
                saveState();
            }
        }
    });
    // Manual runs input saving
    scoreboard.addEventListener('input', (e) => {
        if (e.target.classList.contains('manual-runs')) {
            saveState();
        }
    });

    resetButton.addEventListener('click', resetBoard);

    // --- 初期読込 ---
    loadState();
});
