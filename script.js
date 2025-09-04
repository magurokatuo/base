document.addEventListener('DOMContentLoaded', () => {
    console.log("スコアブックのスクリプトが読み込まれ、初期化処理を開始します。");

    // --- DOM要素の取得 ---
    const visitorTeamInput = document.getElementById('visitor-team-name');
    const homeTeamInput = document.getElementById('home-team-name');
    const visitorTeamCell = document.querySelector('#visitor-score .team-name');
    const homeTeamCell = document.querySelector('#home-score .team-name');
    const scoreBody = document.getElementById('score-body');

    const rostersContainer = document.getElementById('rosters-container');

    // --- 状態保存機能 ---
    const saveState = () => {
        const visitorScores = Array.from(document.querySelectorAll('#visitor-score input[type="number"]')).map(input => input.value);
        const homeScores = Array.from(document.querySelectorAll('#home-score input[type="number"]')).map(input => input.value);
        const visitorRoster = Array.from(document.querySelectorAll('#visitor-roster input[type="text"]')).map(input => input.value);
        const homeRoster = Array.from(document.querySelectorAll('#home-roster input[type="text"]')).map(input => input.value);

        const state = {
            visitorTeamName: visitorTeamInput.value,
            homeTeamName: homeTeamInput.value,
            visitorScores: visitorScores,
            homeScores: homeScores,
            visitorRoster: visitorRoster,
            homeRoster: homeRoster
        };

        localStorage.setItem('baseballScoreboardState', JSON.stringify(state));
    };

    // --- チーム名更新機能 ---
    visitorTeamInput.addEventListener('input', () => {
        visitorTeamCell.textContent = visitorTeamInput.value || visitorTeamInput.placeholder;
        saveState(); // 状態を保存
    });

    homeTeamInput.addEventListener('input', () => {
        homeTeamCell.textContent = homeTeamInput.value || homeTeamInput.placeholder;
        saveState(); // 状態を保存
    });

    // --- 合計点（R）計算機能 ---
    const updateAllTotals = () => {
        document.querySelectorAll('#score-body tr').forEach(row => {
            const scoreInputs = row.querySelectorAll('input[type="number"]');
            const totalRunsCell = row.querySelector('.total-runs');
            let totalRuns = 0;
            scoreInputs.forEach(input => {
                totalRuns += parseInt(input.value) || 0;
            });
            totalRunsCell.textContent = totalRuns;
        });
    };

    // --- イベントリスナー ---
    scoreBody.addEventListener('input', (event) => {
        if (event.target.type === 'number') {
            updateAllTotals(); // 合計を更新
            saveState(); // 状態を保存
        }
    });

    rostersContainer.addEventListener('input', (event) => {
        if (event.target.type === 'text') {
            saveState(); // 状態を保存
        }
    });

    // --- 状態復元機能 ---
    const loadState = () => {
        const savedState = localStorage.getItem('baseballScoreboardState');
        if (savedState) {
            const state = JSON.parse(savedState);

            visitorTeamInput.value = state.visitorTeamName;
            homeTeamInput.value = state.homeTeamName;

            visitorTeamCell.textContent = state.visitorTeamName || visitorTeamInput.placeholder;
            homeTeamCell.textContent = state.homeTeamName || homeTeamInput.placeholder;

            const visitorScoreInputs = document.querySelectorAll('#visitor-score input[type="number"]');
            if (state.visitorScores) {
                state.visitorScores.forEach((score, index) => {
                    if (visitorScoreInputs[index]) visitorScoreInputs[index].value = score;
                });
            }

            const homeScoreInputs = document.querySelectorAll('#home-score input[type="number"]');
            if (state.homeScores) {
                state.homeScores.forEach((score, index) => {
                    if (homeScoreInputs[index]) homeScoreInputs[index].value = score;
                });
            }

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

            updateAllTotals(); // 復元後に合計を再計算
        }
    };

    // --- リセット機能 ---
    const resetButton = document.getElementById('reset-button');

    const resetBoard = () => {
        // チーム名入力フィールドをクリア
        visitorTeamInput.value = '';
        homeTeamInput.value = '';

        // スコアボードのチーム名表示をデフォルトに戻す
        // プレースホルダーからデフォルト値を取得
        visitorTeamCell.textContent = visitorTeamInput.placeholder;
        homeTeamCell.textContent = homeTeamInput.placeholder;

        // 全てのスコア入力フィールドをクリア
        const allScoreInputs = document.querySelectorAll('#scoreboard input[type="number"]');
        allScoreInputs.forEach(input => {
            input.value = '';
        });

        // 全ての選手名簿入力フィールドをクリア
        const allRosterInputs = document.querySelectorAll('#rosters-container input[type="text"]');
        allRosterInputs.forEach(input => {
            input.value = '';
        });

        // 全ての合計（R）を0に戻す
        const allTotals = document.querySelectorAll('.total-runs');
        allTotals.forEach(totalCell => {
            totalCell.textContent = '0';
        });

        // 保存された状態も削除
        localStorage.removeItem('baseballScoreboardState');

        console.log("スコアボードがリセットされ、保存データも削除されました。");
    };

    resetButton.addEventListener('click', resetBoard);

    // --- 初期読込 ---
    loadState();
});
