document.addEventListener('DOMContentLoaded', () => {
    console.log("スコアブックのスクリプトが読み込まれ、初期化処理を開始します。");

    // --- チーム名更新機能 ---
    const visitorTeamInput = document.getElementById('visitor-team-name');
    const homeTeamInput = document.getElementById('home-team-name');
    const visitorTeamCell = document.querySelector('#visitor-score .team-name');
    const homeTeamCell = document.querySelector('#home-score .team-name');

    // ビジターチーム名の更新
    visitorTeamInput.addEventListener('input', () => {
        // 入力があればその値を、なければプレースホルダーの値を表示
        visitorTeamCell.textContent = visitorTeamInput.value || visitorTeamInput.placeholder;
    });

    // ホームチーム名の更新
    homeTeamInput.addEventListener('input', () => {
        // 入力があればその値を、なければプレースホルダーの値を表示
        homeTeamCell.textContent = homeTeamInput.value || homeTeamInput.placeholder;
    });

    // --- 合計点（R）計算機能 ---
    const scoreBody = document.getElementById('score-body');

    // スコア入力欄のイベントを委任で処理
    scoreBody.addEventListener('input', (event) => {
        // イベントが数値入力フィールドから発生した場合のみ処理
        if (event.target.type === 'number') {
            const row = event.target.closest('tr'); // イベントが発生した行を取得
            const scoreInputs = row.querySelectorAll('input[type="number"]');
            const totalRunsCell = row.querySelector('.total-runs');

            let totalRuns = 0;
            scoreInputs.forEach(input => {
                totalRuns += parseInt(input.value) || 0;
            });

            totalRunsCell.textContent = totalRuns;
        }
    });

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

        // 全ての合計（R, H, E）を0に戻す
        const allTotals = document.querySelectorAll('.total-runs, .total-hits, .total-errors');
        allTotals.forEach(totalCell => {
            totalCell.textContent = '0';
        });

        console.log("スコアボードがリセットされました。");
    };

    resetButton.addEventListener('click', resetBoard);
});
