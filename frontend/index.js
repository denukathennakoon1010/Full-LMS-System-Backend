// Add this to your existing HTML (replace localStorage functions)
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Science with Denuka - Complete Learning System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script src="https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { font-family: 'Inter', sans-serif; }
        body { background: linear-gradient(135deg, #0f3b2c 0%, #1a6b4a 100%); min-height: 100vh; }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; transition: all 0.3s ease; }
        .glass-card:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.2); }
        .option-card { transition: all 0.2s ease; cursor: pointer; }
        .option-card.selected { background: linear-gradient(135deg, #2d6a4f 0%, #1b4d3e 100%); color: white; }
        .timer-warning { animation: pulse 1s infinite; background-color: #dc2626 !important; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
        .loading-spinner { border: 3px solid #f3f3f3; border-top: 3px solid #2d6a4f; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .upload-zone { border: 2px dashed #cbd5e1; transition: all 0.2s; cursor: pointer; }
        .upload-zone:hover { border-color: #2d6a4f; background: #f0fdf4; }
        .question-card { background: #f9fafb; border-radius: 12px; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid #2d6a4f; }
        .question-card:hover { background: #f3f4f6; }
        .grade-card { transition: all 0.3s; cursor: pointer; }
        .grade-card.selected { border: 3px solid #2e7d64 !important; background: linear-gradient(135deg, #e6f4ea 0%, #d0ebd9 100%) !important; }
        .package-card { transition: all 0.2s; cursor: pointer; position: relative; }
        .package-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .paper-card { transition: all 0.2s; cursor: pointer; position: relative; }
        .paper-card:hover:not(.locked) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .admin-tab { transition: all 0.2s ease; cursor: pointer; }
        .admin-card { transition: all 0.2s ease; }
        .admin-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .nav-link { transition: all 0.2s ease; cursor: pointer; }
        .nav-link:hover { background: rgba(45, 106, 79, 0.1); transform: translateY(-2px); }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .slip-preview { max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; }
        .account-row { transition: all 0.2s; }
        .account-row:hover { background: #f0fdf4; }
        .package-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: bold; margin: 2px; }
        .package-badge.active { background: #10b981; color: white; }
        .package-badge.inactive { background: #ef4444; color: white; }
        .package-badge.pending { background: #f59e0b; color: white; }
        .insight-bar { transition: width 0.5s ease; }
        .insight-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .top-performer-card { transition: all 0.2s ease; }
        .top-performer-card:hover { transform: translateX(5px); background: #f3f4f6; }
        .session-warning { background: #fee2e2; border-left: 4px solid #dc2626; animation: shake 0.5s ease; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .quiz-image { max-width: 100%; max-height: 200px; object-fit: contain; margin: 10px 0; border-radius: 12px; }
        .option-image { max-width: 60px; max-height: 60px; object-fit: cover; border-radius: 8px; margin-left: 8px; }
        .btn-primary { background-color: #2d6a4f; }
        .btn-primary:hover { background-color: #1b4d3e; }
        .profile-view-card { transition: all 0.3s ease; }
        .profile-view-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .remove-package-btn { transition: all 0.2s; }
        .remove-package-btn:hover { background-color: #dc2626 !important; transform: scale(1.05); }
    </style>
</head>
<body>

    <!-- Navigation Bar -->
    <nav id="mainNav" class="hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-3">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <span class="font-bold text-gray-800">Science with Denuka</span>
            </div>
            <div class="flex gap-2 flex-wrap">
                <button id="navHome" class="nav-link px-4 py-2 rounded-lg text-green-700 font-semibold text-sm">🏠 Home</button>
                <button id="navPackages" class="nav-link px-4 py-2 rounded-lg text-gray-600 font-semibold text-sm">📦 Packages</button>
                <button id="navProfile" class="nav-link px-4 py-2 rounded-lg text-gray-600 font-semibold text-sm">👤 Profile</button>
                <button id="navProgress" class="nav-link px-4 py-2 rounded-lg text-gray-600 font-semibold text-sm">📊 Progress</button>
                <button id="navLogout" class="nav-link px-4 py-2 rounded-lg text-red-600 font-semibold text-sm">🚪 Logout</button>
            </div>
        </div>
    </nav>

    <!-- Session Expired Alert Modal -->
    <div id="sessionExpiredModal" class="hidden fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 text-center session-warning">
            <div class="text-5xl mb-4">🔒</div>
            <h3 class="text-xl font-bold text-red-700 mb-2">Session Expired!</h3>
            <p class="text-gray-600 mb-4">You have been logged out because you logged in from another device or browser.</p>
            <button id="sessionExpiredOkBtn" class="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700">OK - Reload</button>
        </div>
    </div>

    <div class="container mx-auto px-4 py-8 pt-20">
        
        <!-- ==================== LOGIN PAGE ==================== -->
        <div id="loginPage" class="max-w-md mx-auto glass-card p-8 shadow-2xl">
            <div class="text-center mb-6">
                <div class="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h2 class="text-3xl font-bold text-gray-800">Science with Denuka</h2>
                <p class="text-gray-500 mt-1">Complete Learning Management System</p>
                <p class="text-xs text-gray-400 mt-2">Contact administrator to create an account</p>
                <p class="text-xs text-blue-500 mt-1">🔒 One device per account at a time</p>
            </div>
            
            <div id="loginForm">
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">Choose Your Grade</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div id="loginGrade10" class="grade-card bg-white rounded-xl p-4 text-center border-2 border-gray-200 cursor-pointer"><div class="text-3xl font-bold text-green-700">10</div><p class="text-sm">Grade 10 Science</p></div>
                        <div id="loginGrade11" class="grade-card bg-white rounded-xl p-4 text-center border-2 border-gray-200 cursor-pointer"><div class="text-3xl font-bold text-green-700">11</div><p class="text-sm">Grade 11 Science</p></div>
                    </div>
                </div>
                <input type="text" id="loginUsername" placeholder="Username" class="w-full px-4 py-3 rounded-xl border-2 mb-3 focus:border-green-500 outline-none">
                <input type="password" id="loginPassword" placeholder="Password" class="w-full px-4 py-3 rounded-xl border-2 mb-4 focus:border-green-500 outline-none">
                <input type="hidden" id="selectedLoginGrade" value="">
                <button id="loginSubmitBtn" disabled class="w-full bg-gray-400 text-white font-bold py-3 rounded-xl cursor-not-allowed">Select Grade First</button>
                <div class="text-center mt-3 space-x-2">
                    <button id="forgotUsernameBtn" class="text-sm text-blue-600 hover:underline">Forgot Username?</button>
                    <span>|</span>
                    <button id="forgotPasswordBtn" class="text-sm text-blue-600 hover:underline">Forgot Password?</button>
                </div>
            </div>
            
            <button id="adminPortalBtn" class="text-xs text-gray-400 mt-6 text-center w-full hover:text-green-700 transition">🔒 Admin Portal</button>
        </div>

        <!-- FORGOT MODALS -->
        <div id="forgotUsernameModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-2xl max-w-md w-full p-6"><div class="flex justify-between mb-4"><h3 class="text-2xl font-bold text-green-800">🔑 Forgot Username?</h3><button id="closeForgotUsernameModal" class="text-gray-500 text-2xl">&times;</button></div><div class="bg-blue-50 p-4 rounded-lg mb-4"><p class="text-sm text-blue-800">Select your grade to retrieve your username.</p></div><div class="grid grid-cols-2 gap-3 mb-4"><button id="forgotGrade10Btn" class="grade-card bg-white rounded-xl p-3 text-center border-2"><div class="text-2xl font-bold text-green-700">10</div></button><button id="forgotGrade11Btn" class="grade-card bg-white rounded-xl p-3 text-center border-2"><div class="text-2xl font-bold text-green-700">11</div></button></div><button id="searchUsernameBtn" class="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">Search</button><div id="usernameResult" class="hidden mt-4 p-4 bg-green-50 rounded-lg"><div id="usernameList"></div></div></div></div>
        <div id="resetRequestModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-2xl max-w-md w-full p-6"><div class="flex justify-between mb-4"><h3 class="text-2xl font-bold text-green-800">🔐 Request Password Reset</h3><button id="closeResetModal" class="text-gray-500 text-2xl">&times;</button></div><form id="resetRequestForm"><input type="text" id="resetUsername" placeholder="Username" required class="w-full px-4 py-3 rounded-xl border-2 mb-4"><button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700">Submit Request</button></form></div></div>

        <!-- PROFILE PAGE -->
        <div id="profilePage" class="hidden max-w-2xl mx-auto glass-card p-8"><div class="text-center mb-6"><div class="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4"><span class="text-4xl text-white">👤</span></div><h2 class="text-2xl font-bold">My Profile</h2></div><div class="bg-gray-50 rounded-xl p-6 space-y-4"><div class="flex justify-between pb-3 border-b"><span class="font-semibold">Username:</span><span id="profileUsername" class="text-gray-800"></span></div><div class="flex justify-between pb-3 border-b"><span class="font-semibold">Grade:</span><span id="profileGrade" class="text-gray-800"></span></div><div class="flex justify-between pb-3 border-b"><span class="font-semibold">Account Created:</span><span id="profileCreated" class="text-gray-800"></span></div><div class="flex justify-between pb-3 border-b"><span class="font-semibold">Last Login:</span><span id="profileLastLogin" class="text-gray-800"></span></div><div class="flex justify-between pb-3 border-b"><span class="font-semibold">Total Logins:</span><span id="profileLoginCount" class="text-green-600 font-bold text-xl"></span></div><div class="flex justify-between pb-3 border-b"><span class="font-semibold">Total Papers Completed:</span><span id="profileTotalCompleted" class="text-green-600 font-bold text-xl"></span></div></div><button id="profileBackBtn" class="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">← Back to Packages</button></div>

        <!-- PROGRESS PAGE -->
        <div id="progressPage" class="hidden max-w-4xl mx-auto glass-card p-8"><h2 class="text-2xl font-bold text-center mb-6">📊 My Learning Progress</h2><div id="progressSummary" class="space-y-4"></div><div class="mt-6 flex gap-3"><button id="progressBackBtn" class="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">← Back to Packages</button><button id="refreshProgressBtn" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">🔄 Refresh Progress</button></div></div>

        <!-- PACKAGES PAGE -->
        <div id="packagesPage" class="hidden glass-card p-8"><div class="text-center mb-6"><h2 class="text-2xl font-bold">📦 My Learning Packages</h2><p class="text-gray-600">Grade <span id="gradeLabel"></span> | Welcome, <span id="userName"></span></p><div class="mt-2 flex justify-center gap-4 text-xs"><span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded-full"></span> Purchased</span><span class="flex items-center gap-1"><span class="w-3 h-3 bg-yellow-500 rounded-full"></span> Pending</span></div></div><div id="packagesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div></div>

        <!-- PAPERS PAGE -->
        <div id="papersPage" class="hidden glass-card p-8"><div class="flex justify-between items-center mb-6 flex-wrap gap-3"><button id="papersBackBtn" class="bg-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">← Back to Packages</button><div><h2 class="text-2xl font-bold text-center">Package: <span id="currentPkgName"></span></h2><p class="text-xs text-center text-gray-500 mt-1">Each paper can be attempted only 3 times</p></div><div></div></div><div class="bg-blue-50 rounded-xl p-4 mb-6"><div class="flex justify-between items-center"><div><p class="font-semibold">📊 Progress</p><p><span id="attemptedPapersCount">0</span> of <span id="totalPapersCount">0</span> papers attempted</p></div><div class="w-48 bg-gray-200 rounded-full h-3"><div id="progressFill" class="bg-green-600 h-3 rounded-full" style="width:0%"></div></div></div><p class="text-xs text-red-600 mt-2 font-bold">⚠️ Each paper can be attempted ONLY 3 times! After 3 attempts, the paper is locked.</p></div><div id="papersGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div></div>

        <!-- QUIZ PAGE -->
        <div id="quizPage" class="hidden glass-card p-6"><div class="flex justify-between items-center mb-4 flex-wrap gap-2"><button id="quizExitBtn" class="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">✕ Exit</button><div class="bg-gray-200 rounded-full px-4 py-2 font-mono font-bold text-lg"><span>⏰</span> <span id="timerDisplay">60:00</span></div><div><span class="font-semibold">Question <span id="qCurrent">1</span> / <span id="qTotal">0</span></span></div><button id="downloadAnswersBtn" class="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold">📥 Download Answers</button></div><div class="w-full bg-gray-200 rounded-full h-2 mb-6"><div id="quizProgress" class="bg-green-600 h-2 rounded-full" style="width:0%"></div></div>
            <div id="questionImageContainer" class="text-center mb-2"></div>
            <h2 id="questionText" class="text-xl font-bold mb-4"></h2>
            <div id="optionsContainer" class="space-y-3"></div>
            <div class="flex justify-between mt-8"><button id="prevQuestionBtn" class="px-6 py-2 border-2 rounded-lg disabled:opacity-50">← Previous</button><button id="nextQuestionBtn" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Next →</button></div>
        </div>

        <!-- RESULTS PAGE -->
        <div id="resultsPage" class="hidden max-w-2xl mx-auto glass-card p-8 text-center"><div class="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl mb-4">✓</div><h2 class="text-2xl font-bold mb-2">Paper Completed!</h2><div class="bg-green-50 rounded-xl p-4 my-4"><p class="text-lg">Your Score: <span id="finalScore" class="font-bold text-3xl text-green-700"></span></p><p class="text-sm mt-2">Time Taken: <span id="timeTakenDisplay"></span></p><p id="attemptsLeftDisplay" class="text-sm mt-2 text-orange-600 font-semibold"></p></div><div class="flex gap-3"><button id="downloadReportBtn" class="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold">📄 PDF Report</button><button id="resultsBackBtn" class="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">← Back to Papers</button></div></div>

        <!-- PAYMENT MODAL -->
        <div id="paymentModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-2xl max-w-lg w-full p-6"><div class="flex justify-between mb-4"><h3 class="text-2xl font-bold text-green-800">💰 Purchase Package: <span id="payPkgName"></span></h3><button id="closePaymentModal" class="text-gray-500 text-2xl">&times;</button></div><div class="bg-blue-50 p-4 rounded-lg mb-4"><p class="font-semibold">Package Fee: LKR <span id="payFeeAmount"></span></p><p class="text-sm">Each paper can be attempted 3 times. After 3 attempts, the paper is locked.</p></div><div class="bg-yellow-50 p-4 rounded-lg mb-4"><p class="font-semibold">Bank Details:</p><p class="text-sm">Bank: Sample Bank<br>Account: Science with Denuka<br>Number: 123-456-7890</p></div><input type="file" id="bankSlipInput" accept="image/*,.pdf" class="w-full border-2 rounded-lg p-2 mb-3"><input type="text" id="transactionRefInput" placeholder="Transaction Reference" class="w-full border-2 rounded-lg p-2 mb-3"><input type="date" id="paymentDateInput" class="w-full border-2 rounded-lg p-2 mb-3"><input type="number" id="amountPaidInput" placeholder="Amount (LKR)" class="w-full border-2 rounded-lg p-2 mb-4"><button id="confirmPaymentBtn" class="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Submit Payment</button></div></div>

        <!-- WAITING MODAL -->
        <div id="waitingModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-2xl max-w-md w-full p-6 text-center"><div class="loading-spinner"></div><h3 class="text-xl font-bold mt-3">Payment Submitted!</h3><p class="text-gray-600 mt-2">Package pending verification.</p><button id="closeWaitingModal" class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">OK</button></div></div>

        <!-- RESULT MODAL -->
        <div id="resultModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center"><div id="resultIcon" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"></div><h3 id="resultTitle" class="text-xl font-bold mb-2"></h3><p id="resultMessage" class="text-gray-600"></p><button id="closeResultBtn" class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">OK</button></div></div>
        <div id="slipViewModal" class="hidden fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-2xl max-w-2xl w-full p-4"><div class="flex justify-between mb-4"><h3 class="text-2xl font-bold text-green-800">Bank Slip</h3><button id="closeSlipModal" class="text-gray-500 text-2xl">&times;</button></div><img id="slipImage" src="" alt="Bank Slip" class="slip-preview mx-auto"></div></div>

        <!-- EDIT QUESTION MODAL -->
        <div id="editQuestionModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"><div class="flex justify-between mb-4"><h3 class="text-2xl font-bold text-green-800">✏️ Edit Question</h3><button id="closeEditModal" class="text-gray-500 text-2xl">&times;</button></div><div class="space-y-4"><div><label class="font-semibold">Question Image URL (Optional):</label><input type="text" id="editQImage" placeholder="https://example.com/image.jpg" class="w-full border-2 rounded-lg p-2"><p class="text-xs text-gray-500">Enter direct image URL to display above question</p></div><div><label class="font-semibold">Question Text:</label><textarea id="editQText" rows="3" class="w-full border-2 rounded-lg p-2"></textarea></div><div><label>Option A:</label><input type="text" id="editOptA" class="w-full border-2 rounded-lg p-2"><div class="flex gap-2 mt-1"><input type="text" id="editOptAImg" placeholder="Image URL for Option A" class="w-full border rounded-lg p-1 text-sm"><span class="text-xs text-gray-500">(Optional)</span></div></div><div><label>Option B:</label><input type="text" id="editOptB" class="w-full border-2 rounded-lg p-2"><div class="flex gap-2 mt-1"><input type="text" id="editOptBImg" placeholder="Image URL for Option B" class="w-full border rounded-lg p-1 text-sm"><span class="text-xs text-gray-500">(Optional)</span></div></div><div><label>Option C:</label><input type="text" id="editOptC" class="w-full border-2 rounded-lg p-2"><div class="flex gap-2 mt-1"><input type="text" id="editOptCImg" placeholder="Image URL for Option C" class="w-full border rounded-lg p-1 text-sm"><span class="text-xs text-gray-500">(Optional)</span></div></div><div><label>Option D:</label><input type="text" id="editOptD" class="w-full border-2 rounded-lg p-2"><div class="flex gap-2 mt-1"><input type="text" id="editOptDImg" placeholder="Image URL for Option D" class="w-full border rounded-lg p-1 text-sm"><span class="text-xs text-gray-500">(Optional)</span></div></div><div><label>Correct Answer:</label><select id="editCorrectAns" class="w-full border-2 rounded-lg p-2"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></div></div><div class="flex gap-3 mt-6"><button id="saveEditBtn" class="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold">💾 Save</button><button id="cancelEditBtn" class="flex-1 bg-gray-300 py-2 rounded-lg font-semibold">Cancel</button></div></div></div>

        <!-- ADMIN MODAL -->
        <div id="adminModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b px-6 py-4"><div class="flex justify-between"><div><h3 class="text-2xl font-bold text-green-800">Admin Dashboard</h3><p class="text-sm text-gray-500">Complete Management System</p></div><button id="closeAdminModalBtn" class="text-gray-400 text-2xl">&times;</button></div><input type="password" id="adminPasswordInput" placeholder="Enter Admin Password" class="w-full border-2 rounded-lg p-2 mt-3"><button id="adminLoginBtn" class="mt-2 w-full bg-green-600 text-white py-2 rounded-lg">Login</button></div>
                <div id="adminPanelContent" class="hidden">
                    <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b"><h4 class="font-bold mb-4">📊 System Overview</h4><div class="grid grid-cols-2 md:grid-cols-7 gap-4">
                        <div class="stat-card bg-white rounded-xl p-4 text-center"><div class="text-2xl font-bold text-green-600" id="statStudents">0</div><div class="text-xs">Total Students</div></div>
                        <div class="stat-card bg-white rounded-xl p-4 text-center"><div class="text-2xl font-bold text-blue-600" id="statActivePkgs">0</div><div class="text-xs">Active Packages</div></div>
                        <div class="stat-card bg-white rounded-xl p-4 text-center"><div class="text-2xl font-bold text-purple-600" id="statCompletedPapers">0</div><div class="text-xs">Completed Papers</div></div>
                        <div class="stat-card bg-white rounded-xl p-4 text-center"><div class="text-2xl font-bold text-yellow-600" id="statPendingPay">0</div><div class="text-xs">Pending Payments</div></div>
                        <div class="stat-card bg-white rounded-xl p-4 text-center"><div class="text-2xl font-bold text-orange-600" id="statTotalLogins">0</div><div class="text-xs">Total Logins</div></div>
                        <div class="stat-card bg-white rounded-xl p-4 text-center"><div class="text-2xl font-bold text-pink-600" id="statResetReqs">0</div><div class="text-xs">Reset Requests</div></div>
                        <div class="stat-card bg-white rounded-xl p-4 text-center"><div class="text-2xl font-bold text-indigo-600" id="statTotalPapers">0</div><div class="text-xs">Total Papers</div></div>
                    </div></div>
                    
                    <!-- NEW: User Profile Search Section -->
                    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b">
                        <h4 class="font-bold text-indigo-800 mb-3 flex items-center gap-2">🔍 User Profile Management</h4>
                        <div class="flex gap-3 items-center flex-wrap">
                            <input type="text" id="adminUserSearchInput" placeholder="Enter Username to View Profile" class="flex-1 px-4 py-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none">
                            <button id="adminUserSearchBtn" class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">🔍 Search & View Profile</button>
                        </div>
                        <div id="userProfileView" class="hidden mt-4 bg-white rounded-xl p-5 shadow-lg"></div>
                    </div>
                    
                    <div class="border-b px-6 pt-4"><div class="flex flex-wrap gap-1">
                        <button id="adminTabDashboard" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-green-100 text-green-800">📊 Dashboard</button>
                        <button id="adminTabActivity" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">⏰ Activity</button>
                        <button id="adminTabStudents" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">👥 All Students</button>
                        <button id="adminTabCreateAccount" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">➕ Create Account</button>
                        <button id="adminTabPackageManagement" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">📦 Package Management</button>
                        <button id="adminTabInsights" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">📈 Paper Insights</button>
                        <button id="adminTabSessions" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">🔐 Active Sessions</button>
                        <button id="adminTabAccountRecords" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">📋 Account Records</button>
                        <button id="adminTabReset" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">🔐 Reset Requests</button>
                        <button id="adminTabPayments" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">💰 Pending Payments</button>
                        <button id="adminTabCompleted" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">📊 Completed Papers</button>
                        <button id="adminTabManagePapers" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">📝 Manage Papers</button>
                        <button id="adminTabResetPapers" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">🔄 Reset Papers</button>
                        <button id="adminTabSettings" class="admin-tab px-5 py-2.5 rounded-t-lg font-semibold text-sm bg-gray-100 text-gray-600">⚙️ Settings</button>
                    </div></div>
                    <div class="p-6">
                        <!-- Dashboard Panel -->
                        <div id="adminDashboardPanel" class="space-y-4"><div class="grid md:grid-cols-2 gap-6"><div class="bg-white rounded-xl p-5 border"><h4 class="font-bold text-lg mb-3">📈 Recent Activity</h4><div id="recentActivityList" class="space-y-3 max-h-96 overflow-y-auto"></div></div><div class="bg-white rounded-xl p-5 border"><h4 class="font-bold text-lg mb-3">🏆 Top Students</h4><div id="topStudentsList" class="space-y-2 max-h-96 overflow-y-auto"></div></div></div></div>
                        
                        <!-- Activity Panel -->
                        <div id="adminActivityPanel" class="hidden space-y-3 max-h-96 overflow-y-auto"></div>
                        
                        <!-- Students Panel -->
                        <div id="adminStudentsPanel" class="hidden space-y-3"></div>
                        
                        <!-- Create Account Panel -->
                        <div id="adminCreateAccountPanel" class="hidden"><div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border-2 border-green-200"><h3 class="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">➕ Create New Student Account</h3><p class="text-gray-600 mb-6">Create student accounts manually. Students will login with these credentials.</p><div class="grid md:grid-cols-2 gap-6"><div><label class="block text-sm font-semibold text-gray-700 mb-2">Username *</label><input type="text" id="newUsername" placeholder="Enter username" class="w-full px-4 py-3 rounded-xl border-2 focus:border-green-500 outline-none"><p class="text-xs text-gray-500 mt-1">Must be unique. Min 3 characters.</p></div><div><label class="block text-sm font-semibold text-gray-700 mb-2">Password *</label><input type="text" id="newPassword" placeholder="Enter password" class="w-full px-4 py-3 rounded-xl border-2 focus:border-green-500 outline-none"><p class="text-xs text-gray-500 mt-1">Min 4 characters.</p></div><div><label class="block text-sm font-semibold text-gray-700 mb-2">Select Grade *</label><div class="flex gap-4"><label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="newGrade" value="10" class="w-4 h-4 text-green-600"> Grade 10</label><label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="newGrade" value="11" class="w-4 h-4 text-green-600"> Grade 11</label></div></div><div class="flex items-end"><button id="createAccountBtn" class="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">✅ Create Account</button></div></div><div id="createAccountResult" class="mt-4 hidden p-3 rounded-lg"></div></div></div>
                        
                        <!-- PACKAGE MANAGEMENT PANEL -->
                        <div id="adminPackageManagementPanel" class="hidden">
                            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                                <h3 class="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">✨ Create New Package</h3>
                                <p class="text-gray-600 mb-6">Create custom packages and assign them to specific students.</p>
                                <div class="grid md:grid-cols-4 gap-4 mb-6">
                                    <div><label class="block text-sm font-semibold text-gray-700 mb-1">Package Name *</label><input type="text" id="newPkgName" placeholder="e.g., Biology Advanced" class="w-full px-3 py-2 rounded-lg border-2"></div>
                                    <div><label class="block text-sm font-semibold text-gray-700 mb-1">Number of Papers *</label><input type="number" id="newPkgPapers" placeholder="e.g., 10" class="w-full px-3 py-2 rounded-lg border-2"></div>
                                    <div><label class="block text-sm font-semibold text-gray-700 mb-1">Fee (LKR) *</label><input type="number" id="newPkgFee" placeholder="e.g., 2000" class="w-full px-3 py-2 rounded-lg border-2"></div>
                                    <div><label class="block text-sm font-semibold text-gray-700 mb-1">Grade *</label><select id="newPkgGrade" class="w-full px-3 py-2 rounded-lg border-2"><option value="10">Grade 10</option><option value="11">Grade 11</option></select></div>
                                </div>
                                <button id="createNewPackageBtn" class="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700">✨ Create Package</button>
                                <div id="packageCreateResult" class="mt-3 hidden text-sm"></div>
                            </div>
                            
                            <div class="bg-white rounded-xl p-5 border mb-6"><h4 class="font-bold text-lg mb-3">📦 All Packages</h4><div id="allPackagesList" class="space-y-3 max-h-96 overflow-y-auto"></div></div>
                            
                            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border mb-6">
                                <h4 class="font-bold text-blue-800 mb-3 flex items-center gap-2">👥 Assign Package to Student</h4>
                                <div class="grid md:grid-cols-2 gap-4 mb-4">
                                    <div><label class="block text-sm font-semibold">Select Student</label><select id="assignPkgStudentSelect" class="w-full border rounded-lg p-2"></select></div>
                                    <div><label class="block text-sm font-semibold">Select Package</label><select id="assignPkgSelect" class="w-full border rounded-lg p-2"></select></div>
                                </div>
                                <button id="assignPkgToStudentBtn" class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">📦 Assign Package to Student</button>
                                <div id="assignPkgResult" class="mt-3 hidden p-2 rounded"></div>
                            </div>
                            
                            <div class="bg-indigo-50 rounded-xl p-4"><h4 class="font-bold text-indigo-800 mb-2">📋 Student Package Assignments</h4><div id="studentAssignmentsList" class="space-y-2 max-h-96 overflow-y-auto"></div></div>
                        </div>
                        
                        <!-- PAPER INSIGHTS PANEL -->
                        <div id="adminInsightsPanel" class="hidden">
                            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
                                <h3 class="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">📊 Paper Performance Insights</h3>
                                <p class="text-gray-600 mb-6">Analyze how students performed on each question of a paper.</p>
                                <div class="grid md:grid-cols-4 gap-4 mb-6">
                                    <div><label class="block text-sm font-semibold text-gray-700 mb-1">Select Grade</label><select id="insightGradeSelect" class="w-full px-3 py-2 rounded-lg border-2"><option value="10">Grade 10</option><option value="11">Grade 11</option></select></div>
                                    <div><label class="block text-sm font-semibold text-gray-700 mb-1">Select Package</label><select id="insightPackageSelect" class="w-full px-3 py-2 rounded-lg border-2"><option value="">-- Select Package --</option></select></div>
                                    <div><label class="block text-sm font-semibold text-gray-700 mb-1">Select Paper</label><select id="insightPaperSelect" class="w-full px-3 py-2 rounded-lg border-2"></select></div>
                                    <div class="flex items-end"><button id="loadInsightsBtn" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">📈 Load Insights</button></div>
                                </div>
                            </div>
                            <div id="insightsResults" class="hidden"><div class="bg-white rounded-xl p-5 border mb-4"><div class="flex justify-between items-center mb-4 flex-wrap gap-2"><h4 class="font-bold text-lg">📊 Overall Statistics</h4><button id="exportInsightsBtn" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">📥 Export to CSV</button></div><div id="overallStats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"></div></div><div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200 mb-4"><div class="flex justify-between items-center mb-4 flex-wrap gap-2"><h4 class="font-bold text-lg flex items-center gap-2">🏆 Top Performers</h4><button id="exportTopPerformersBtn" class="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">📥 Export Top Performers</button></div><div id="topPerformersList" class="space-y-2 max-h-96 overflow-y-auto"></div></div><div id="questionsInsights" class="space-y-4"></div></div>
                            <div id="insightsLoading" class="hidden text-center py-8"><div class="loading-spinner"></div><p class="mt-2">Loading insights...</p></div>
                            <div id="insightsEmpty" class="hidden text-center py-8 text-gray-500"><p>No attempts recorded for this paper yet.</p></div>
                        </div>
                        
                        <!-- ACTIVE SESSIONS PANEL -->
                        <div id="adminSessionsPanel" class="hidden"><div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-cyan-200"><h3 class="text-2xl font-bold text-cyan-800 mb-4 flex items-center gap-2">🔐 Active User Sessions</h3><p class="text-gray-600 mb-6">View all currently active user sessions across all devices.</p><div id="activeSessionsList" class="space-y-3 max-h-96 overflow-y-auto"></div></div></div>
                        
                        <!-- Account Records Panel -->
                        <div id="adminAccountRecordsPanel" class="hidden"><div class="bg-purple-50 rounded-xl p-4 mb-6 border-2 border-purple-200"><h3 class="text-xl font-bold text-purple-800 mb-2 flex items-center gap-2">📋 Account Creation Records</h3><p class="text-sm text-purple-600">Complete history of all student accounts created by admin.</p></div><div class="overflow-x-auto"><table class="w-full bg-white rounded-xl overflow-hidden border"><thead class="bg-gray-800 text-white"><tr><th class="px-4 py-3 text-left">#</th><th class="px-4 py-3 text-left">Username</th><th class="px-4 py-3 text-left">Grade</th><th class="px-4 py-3 text-left">Created By</th><th class="px-4 py-3 text-left">Created Date</th><th class="px-4 py-3 text-left">Last Login</th><th class="px-4 py-3 text-left">Login Count</th></tr></thead><tbody id="accountRecordsTable"><tr><td colspan="7" class="text-center py-8 text-gray-500">No accounts created yet<th></tr></tbody></table></div><div class="mt-4 flex justify-end"><button id="exportAccountsBtn" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">📥 Export Accounts to CSV</button></div></div>
                        
                        <!-- Reset Requests Panel -->
                        <div id="adminResetPanel" class="hidden space-y-4"><div id="resetRequestsContainer" class="space-y-4"></div></div>
                        
                        <!-- Payments Panel -->
                        <div id="adminPaymentsPanel" class="hidden space-y-4"></div>
                        
                        <!-- Completed Papers Panel -->
                        <div id="adminCompletedPanel" class="hidden space-y-3"></div>
                        
                        <!-- Manage Papers Panel -->
                        <div id="adminManagePapersPanel" class="hidden">
                            <div class="bg-indigo-50 rounded-lg p-4 mb-4"><p class="text-indigo-800 font-semibold">📝 Upload / Edit Questions</p><p class="text-sm text-indigo-600">Upload Excel or edit questions individually. Now with Image Support!</p></div>
                            <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-6 border-2 border-emerald-200"><h4 class="font-bold text-emerald-800 mb-3 flex items-center gap-2">➕ Add New Paper to Package</h4><div class="grid md:grid-cols-4 gap-4 mb-4"><select id="addPaperGradeSelect" class="border rounded-lg p-2"><option value="10">Grade 10</option><option value="11">Grade 11</option></select><select id="addPaperPackageSelect" class="border rounded-lg p-2"></select><input type="number" id="newPaperNumber" placeholder="Paper Number (e.g., 9)" class="border rounded-lg p-2" min="1"><button id="addNewPaperBtn" class="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700">➕ Create New Paper</button></div><p class="text-xs text-gray-500 mt-2">💡 New paper will be created with 10 default sample questions. You can edit them after creation.</p></div>
                            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 mb-6"><h4 class="font-bold text-blue-800 mb-3">📤 Bulk Upload Excel File (with Images)</h4><div class="grid md:grid-cols-3 gap-4 mb-4"><select id="bulkGradeSelect" class="border rounded-lg p-2"><option value="10">Grade 10</option><option value="11">Grade 11</option></select><select id="bulkPackageSelect" class="border rounded-lg p-2"></select><select id="bulkPaperSelect" class="border rounded-lg p-2"></select></div><div class="bg-yellow-50 p-3 rounded-lg mb-3 text-sm"><p class="font-semibold">📋 CSV Format Example (with Images):</p><p class="font-mono text-xs">Question,Option A,Option B,Option C,Option D,Correct Answer,Question Image,Option A Image,Option B Image,Option C Image,Option D Image</p></div><div class="upload-zone rounded-xl p-6 text-center bg-white" id="uploadZone"><input type="file" id="bulkFileInput" accept=".xlsx,.xls,.csv" class="hidden"><div class="text-4xl mb-2">📎</div><p>Click to upload Excel/CSV file</p></div><div id="uploadPreview" class="hidden mt-4 p-3 bg-white rounded-lg border"></div><button id="confirmUploadBtn" class="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hidden">✅ Replace Paper</button></div>
                            <div class="border-t pt-4"><h4 class="font-bold mb-3">✏️ Edit Questions Individually</h4><div class="grid md:grid-cols-4 gap-4 mb-4"><select id="editGradeSelect" class="border rounded-lg p-2"><option value="10">Grade 10</option><option value="11">Grade 11</option></select><select id="editPackageSelect" class="border rounded-lg p-2"></select><select id="editPaperSelect" class="border rounded-lg p-2"></select><button id="loadQuestionsBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg">📖 Load Questions</button></div><div id="questionsEditor" class="space-y-4 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-xl"></div><div class="mt-4"><button id="addNewQuestionBtn" class="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold">➕ Add New Question</button></div></div>
                        </div>
                        
                        <!-- Reset Papers Panel -->
                        <div id="adminResetPapersPanel" class="hidden"><div class="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200"><p class="text-orange-800 font-semibold text-lg">🔄 Reset Student Paper Attempts</p><p class="text-sm text-orange-600">Select a student, grade, package, and paper to reset their attempts. This gives them 3 new attempts.</p></div><div class="grid md:grid-cols-5 gap-4 mb-6"><div><label class="block text-sm font-bold mb-1">Select Student</label><select id="resetStudentSelect" class="w-full border rounded-lg p-2"></select></div><div><label class="block text-sm font-bold mb-1">Grade</label><select id="resetGradeSelect" class="w-full border rounded-lg p-2"><option value="10">Grade 10</option><option value="11">Grade 11</option></select></div><div><label class="block text-sm font-bold mb-1">Package</label><select id="resetPackageSelect" class="w-full border rounded-lg p-2"></select></div><div><label class="block text-sm font-bold mb-1">Paper Number</label><select id="resetPaperSelect" class="w-full border rounded-lg p-2"></select></div><div class="flex items-end"><button id="resetPaperBtn" class="bg-orange-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-orange-700">🔄 Reset Paper</button></div></div><div class="border-t pt-4 mt-4"><h4 class="font-bold text-lg text-red-700 mb-3">⚠️ Reset Entire Package</h4><div class="grid md:grid-cols-4 gap-4"><div><label class="block text-sm font-bold mb-1">Select Student</label><select id="resetPackageStudentSelect" class="w-full border rounded-lg p-2"></select></div><div><label class="block text-sm font-bold mb-1">Grade</label><select id="resetPackageGradeSelect" class="w-full border rounded-lg p-2"><option value="10">Grade 10</option><option value="11">Grade 11</option></select></div><div><label class="block text-sm font-bold mb-1">Package</label><select id="resetPackagePkgSelect" class="w-full border rounded-lg p-2"></select></div><div class="flex items-end"><button id="resetPackageBtnAdmin" class="bg-red-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-red-700">⚠️ Reset Entire Package</button></div></div></div><div id="resetResultMsg" class="mt-4 p-3 rounded-lg hidden"></div></div>
                        
                        <!-- Settings Panel -->
                        <div id="adminSettingsPanel" class="hidden"><div class="bg-white rounded-xl p-5 border"><h4 class="font-bold text-lg mb-3">📦 Package Settings</h4><p class="text-gray-500">Package fees are managed in Package Management section.</p></div><div class="bg-white rounded-xl p-5 border mt-4"><h4 class="font-bold text-lg mb-3">🔄 Data Management</h4><button onclick="if(window.exportAllData) exportAllData()" class="w-full bg-green-600 text-white py-2 rounded-lg mb-2">📥 Export All Data (JSON)</button><button onclick="if(window.clearAllData) clearAllData()" class="w-full bg-red-600 text-white py-2 rounded-lg">⚠️ Clear All Data (Reset System)</button></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // ==================== CONSTANTS ====================
        const MAX_ATTEMPTS = 3;
        const TIME_LIMIT_SEC = 3600;
        
        const STORAGE = {
            STUDENTS: 'lms_students',
            PAYMENTS: 'lms_payments',
            ATTEMPTS: 'lms_attempts',
            QUESTIONS: 'lms_questions',
            SETTINGS: 'lms_settings',
            ACTIVITY: 'lms_activity',
            RESETS: 'lms_resets',
            ACCOUNT_LOGS: 'lms_account_logs',
            ASSIGNMENTS: 'lms_assignments',
            PACKAGES: 'lms_packages',
            ANSWER_RECORDS: 'lms_answer_records',
            PAPER_SCORES: 'lms_paper_scores',
            ACTIVE_SESSIONS: 'lms_active_sessions'
        };
        
        const SAMPLE_QS = [
            { id: 1, text: "What is the basic unit of life?", options: ["Atom", "Cell", "Tissue", "Organ"], correct: 1, qImage: "", optImages: ["","","",""] },
            { id: 2, text: "Which planet is known as the Red Planet?", options: ["Earth", "Venus", "Mars", "Jupiter"], correct: 2, qImage: "", optImages: ["","","",""] },
            { id: 3, text: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2, qImage: "", optImages: ["","","",""] },
            { id: 4, text: "What is H2O commonly known as?", options: ["Salt", "Water", "Oxygen", "Hydrogen"], correct: 1, qImage: "", optImages: ["","","",""] },
            { id: 5, text: "Which organ pumps blood?", options: ["Liver", "Brain", "Heart", "Kidney"], correct: 2, qImage: "", optImages: ["","","",""] },
            { id: 6, text: "What force pulls objects to Earth?", options: ["Magnetism", "Gravity", "Friction", "Electricity"], correct: 1, qImage: "", optImages: ["","","",""] },
            { id: 7, text: "Which vitamin is produced by sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3, qImage: "", optImages: ["","","",""] },
            { id: 8, text: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, qImage: "", optImages: ["","","",""] },
            { id: 9, text: "Which is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3, qImage: "", optImages: ["","","",""] },
            { id: 10, text: "What is the hardest natural substance?", options: ["Iron", "Diamond", "Gold", "Platinum"], correct: 1, qImage: "", optImages: ["","","",""] }
        ];
        
        // Global variables
        let currentUser = null, currentGrade = null, currentPackageKey = null, currentPaper = null;
        let currentQuestions = [], userAnswers = {}, currentIndex = 0, quizActive = false;
        let timer = null, timeLeft = 0, quizResult = null;
        let currentEditQ = null, editGrade = null, editPkgKey = null, editPaper = null;
        let sessionCheckInterval = null;
        
        // Package storage functions
        function getAllPackages() {
            return JSON.parse(localStorage.getItem(STORAGE.PACKAGES) || '[]');
        }
        
        function savePackages(packages) {
            localStorage.setItem(STORAGE.PACKAGES, JSON.stringify(packages));
        }
        
        function createPackage(name, paperCount, fee, grade) {
            let packages = getAllPackages();
            let newId = Date.now();
            let newPackage = {
                id: newId,
                name: name,
                paperCount: parseInt(paperCount),
                fee: parseInt(fee),
                grade: parseInt(grade),
                createdAt: new Date().toISOString()
            };
            packages.push(newPackage);
            savePackages(packages);
            
            let allQs = JSON.parse(localStorage.getItem(STORAGE.QUESTIONS) || '{}');
            if (!allQs[grade]) allQs[grade] = {};
            let pkgKey = `pkg_${newId}`;
            if (!allQs[grade][pkgKey]) allQs[grade][pkgKey] = {};
            for (let p = 1; p <= paperCount; p++) {
                if (!allQs[grade][pkgKey][p]) {
                    allQs[grade][pkgKey][p] = SAMPLE_QS.map((q, idx) => ({ 
                        ...q, 
                        id: Date.now() + Math.random() * 10000 + p * 1000 + idx, 
                        text: q.text + ` (${name} - Paper ${p})` 
                    }));
                }
            }
            localStorage.setItem(STORAGE.QUESTIONS, JSON.stringify(allQs));
            
            logActivity('admin', 'create_package', `Created package: ${name} (ID: ${newId})`);
            return newPackage;
        }
        
        function deletePackage(pkgId) {
            let packages = getAllPackages();
            let pkg = packages.find(p => p.id === pkgId);
            if (!pkg) return false;
            
            savePackages(packages.filter(p => p.id !== pkgId));
            
            let allQs = JSON.parse(localStorage.getItem(STORAGE.QUESTIONS) || '{}');
            let pkgKey = `pkg_${pkgId}`;
            if (allQs[pkg.grade] && allQs[pkg.grade][pkgKey]) {
                delete allQs[pkg.grade][pkgKey];
            }
            localStorage.setItem(STORAGE.QUESTIONS, JSON.stringify(allQs));
            
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            for (let username in assignments) {
                for (let grade in assignments[username]) {
                    if (assignments[username][grade][pkgKey]) {
                        delete assignments[username][grade][pkgKey];
                    }
                }
            }
            localStorage.setItem(STORAGE.ASSIGNMENTS, JSON.stringify(assignments));
            
            logActivity('admin', 'delete_package', `Deleted package: ${pkg.name}`);
            return true;
        }
        
        function getPackageByKey(pkgKey) {
            if (!pkgKey || !pkgKey.startsWith('pkg_')) return null;
            let pkgId = parseInt(pkgKey.replace('pkg_', ''));
            let packages = getAllPackages();
            return packages.find(p => p.id === pkgId);
        }
        
        function getUserPackages(username, grade) {
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            let userAssignments = assignments[username]?.[grade] || {};
            let assignedPkgKeys = Object.keys(userAssignments);
            
            let allPackages = getAllPackages();
            let userPackages = [];
            
            for (let assignedKey of assignedPkgKeys) {
                let pkgId = parseInt(assignedKey.replace('pkg_', ''));
                let pkg = allPackages.find(p => p.id === pkgId);
                
                if (pkg && pkg.grade === parseInt(grade)) {
                    let hasAccess = true;
                    let isPending = false;
                    
                    let payments = JSON.parse(localStorage.getItem(STORAGE.PAYMENTS) || '{}');
                    let paymentStatus = payments[username]?.[grade]?.[assignedKey]?.status;
                    if (paymentStatus === 'pending') {
                        isPending = true;
                    } else if (paymentStatus === 'approved') {
                        hasAccess = true;
                    }
                    
                    userPackages.push({
                        key: assignedKey,
                        id: pkg.id,
                        name: pkg.name,
                        paperCount: pkg.paperCount,
                        fee: pkg.fee,
                        hasAccess: hasAccess,
                        isPending: isPending
                    });
                }
            }
            
            return userPackages;
        }
        
        function assignPackageToStudent(username, grade, pkgId) {
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            if (!assignments[username]) assignments[username] = {};
            if (!assignments[username][grade]) assignments[username][grade] = {};
            let pkgKey = `pkg_${pkgId}`;
            assignments[username][grade][pkgKey] = { assignedAt: new Date().toISOString(), assignedBy: 'admin' };
            localStorage.setItem(STORAGE.ASSIGNMENTS, JSON.stringify(assignments));
            logActivity('admin', 'assign_package', `Assigned package ${pkgId} to ${username}`);
            return true;
        }
        
        function removePackageFromStudent(username, grade, pkgKey) {
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            if (assignments[username]?.[grade]?.[pkgKey]) {
                delete assignments[username][grade][pkgKey];
                localStorage.setItem(STORAGE.ASSIGNMENTS, JSON.stringify(assignments));
                logActivity('admin', 'remove_package', `Removed package ${pkgKey} from ${username}`);
                return true;
            }
            return false;
        }
        
        function deleteUserAccount(username) {
            let students = getAllStudentsList();
            if (!students[username]) return false;
            
            // Delete user from students
            delete students[username];
            localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(students));
            
            // Delete user's assignments
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            if (assignments[username]) delete assignments[username];
            localStorage.setItem(STORAGE.ASSIGNMENTS, JSON.stringify(assignments));
            
            // Delete user's attempts
            let attempts = JSON.parse(localStorage.getItem(STORAGE.ATTEMPTS) || '{}');
            if (attempts[username]) delete attempts[username];
            localStorage.setItem(STORAGE.ATTEMPTS, JSON.stringify(attempts));
            
            // Delete user's payments
            let payments = JSON.parse(localStorage.getItem(STORAGE.PAYMENTS) || '{}');
            if (payments[username]) delete payments[username];
            localStorage.setItem(STORAGE.PAYMENTS, JSON.stringify(payments));
            
            logActivity('admin', 'delete_account', `Deleted account: ${username}`);
            return true;
        }
        
        function changeUserGrade(username, newGrade) {
            let students = getAllStudentsList();
            if (!students[username]) return false;
            students[username].grade = parseInt(newGrade);
            localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(students));
            logActivity('admin', 'change_grade', `Changed ${username}'s grade to ${newGrade}`);
            return true;
        }
        
        function changeUserPassword(username, newPassword) {
            let students = getAllStudentsList();
            if (!students[username]) return false;
            students[username].password = newPassword;
            localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(students));
            logActivity('admin', 'change_password', `Changed password for ${username}`);
            return true;
        }
        
        function getUserAssignedPackagesList(username, grade) {
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            let userAssignments = assignments[username]?.[grade] || {};
            let allPackages = getAllPackages();
            let result = [];
            
            for (let key in userAssignments) {
                let pkgId = parseInt(key.replace('pkg_', ''));
                let pkg = allPackages.find(p => p.id === pkgId);
                if (pkg) {
                    result.push({ key: key, id: pkg.id, name: pkg.name });
                }
            }
            return result;
        }
        
        function renderUserProfileView(username) {
            let students = getAllStudentsList();
            let user = students[username];
            if (!user) {
                document.getElementById('userProfileView').innerHTML = `<div class="bg-red-100 text-red-700 p-4 rounded-lg text-center">❌ User "${username}" not found!</div>`;
                document.getElementById('userProfileView').classList.remove('hidden');
                return;
            }
            
            let assignedPackages = getUserAssignedPackagesList(username, user.grade);
            let allPackages = getAllPackages();
            let availablePackages = allPackages.filter(p => p.grade === user.grade && !assignedPackages.some(ap => ap.id === p.id));
            
            let packagesHtml = '';
            if (assignedPackages.length === 0) {
                packagesHtml = '<div class="text-gray-500 italic">No packages assigned yet.</div>';
            } else {
                packagesHtml = '<div class="space-y-2">';
                for (let pkg of assignedPackages) {
                    packagesHtml += `<div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>📦 ${escapeHtml(pkg.name)}</span>
                        <button onclick="window.removePackageFromUser('${username}', '${pkg.key}')" class="remove-package-btn bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Remove</button>
                    </div>`;
                }
                packagesHtml += '</div>';
            }
            
            let addPackageHtml = '';
            if (availablePackages.length > 0) {
                addPackageHtml = `
                    <div class="mt-3">
                        <label class="block text-sm font-semibold mb-2">➕ Add New Package:</label>
                        <div class="flex gap-2">
                            <select id="addPackageSelect_${username}" class="flex-1 border rounded-lg p-2 text-sm">
                                <option value="">-- Select Package --</option>
                                ${availablePackages.map(p => `<option value="${p.id}">${escapeHtml(p.name)} (LKR ${p.fee})</option>`).join('')}
                            </select>
                            <button onclick="window.addPackageToUser('${username}', ${user.grade})" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Add</button>
                        </div>
                    </div>
                `;
            }
            
            let profileHtml = `
                <div class="space-y-4">
                    <div class="flex justify-between items-start border-b pb-3">
                        <div>
                            <h3 class="text-xl font-bold text-green-800">👤 ${escapeHtml(username)}</h3>
                            <p class="text-sm text-gray-500">User Profile</p>
                        </div>
                        <button onclick="window.deleteUserAccountConfirm('${username}')" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">🗑️ Delete Account</button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <label class="text-xs text-gray-500">Username</label>
                            <p class="font-semibold">${escapeHtml(username)}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <label class="text-xs text-gray-500">Password</label>
                            <div class="flex gap-2 items-center">
                                <p class="font-semibold flex-1">••••••••</p>
                                <button onclick="window.changeUserPasswordPrompt('${username}')" class="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">Change</button>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <label class="text-xs text-gray-500">Grade</label>
                            <div class="flex gap-2 items-center">
                                <p class="font-semibold flex-1">Grade ${user.grade}</p>
                                <button onclick="window.changeUserGradePrompt('${username}', ${user.grade})" class="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">Change</button>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <label class="text-xs text-gray-500">Account Created</label>
                            <p class="font-semibold">${new Date(user.createdAt).toLocaleString()}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <label class="text-xs text-gray-500">Last Login</label>
                            <p class="font-semibold">${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <label class="text-xs text-gray-500">Total Logins</label>
                            <p class="font-semibold text-green-600">${user.loginCount || 0}</p>
                        </div>
                    </div>
                    
                    <div class="border-t pt-4">
                        <h4 class="font-bold text-lg mb-3 flex items-center gap-2">📦 Assigned Packages</h4>
                        ${packagesHtml}
                        ${addPackageHtml}
                    </div>
                </div>
            `;
            
            document.getElementById('userProfileView').innerHTML = profileHtml;
            document.getElementById('userProfileView').classList.remove('hidden');
        }
        
        window.removePackageFromUser = function(username, pkgKey) {
            let students = getAllStudentsList();
            let user = students[username];
            if (!user) return;
            if (confirm(`Remove this package from ${username}?`)) {
                removePackageFromStudent(username, user.grade, pkgKey);
                renderUserProfileView(username);
                updateStudentAssignmentsList();
                if (currentUser && currentUser.username === username && currentGrade == user.grade) showPackages();
                alert("Package removed successfully!");
            }
        };
        
        window.addPackageToUser = function(username, grade) {
            let select = document.getElementById(`addPackageSelect_${username}`);
            let pkgId = select.value;
            if (!pkgId) {
                alert("Please select a package to add");
                return;
            }
            assignPackageToStudent(username, grade, parseInt(pkgId));
            renderUserProfileView(username);
            updateStudentAssignmentsList();
            if (currentUser && currentUser.username === username && currentGrade == grade) showPackages();
            alert("Package added successfully!");
        };
        
        window.deleteUserAccountConfirm = function(username) {
            if (confirm(`⚠️ WARNING: This will permanently delete ALL data for user "${username}" including attempts, payments, and assignments.\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?`)) {
                if (deleteUserAccount(username)) {
                    alert(`User "${username}" has been deleted.`);
                    document.getElementById('userProfileView').classList.add('hidden');
                    document.getElementById('adminUserSearchInput').value = '';
                    loadAdminData();
                    updateAssignDropdowns();
                    updateStudentAssignmentsList();
                } else {
                    alert("Failed to delete user.");
                }
            }
        };
        
        window.changeUserGradePrompt = function(username, currentGrade) {
            let newGrade = prompt(`Enter new grade for ${username} (10 or 11):`, currentGrade);
            if (newGrade && (newGrade === '10' || newGrade === '11')) {
                if (changeUserGrade(username, newGrade)) {
                    alert(`Grade changed to ${newGrade} for ${username}`);
                    renderUserProfileView(username);
                    if (currentUser && currentUser.username === username) {
                        alert("Note: You will need to login again for grade change to take effect.");
                    }
                } else {
                    alert("Failed to change grade.");
                }
            } else if (newGrade) {
                alert("Please enter valid grade (10 or 11)");
            }
        };
        
        window.changeUserPasswordPrompt = function(username) {
            let newPassword = prompt(`Enter new password for ${username} (min 4 characters):`);
            if (newPassword && newPassword.length >= 4) {
                if (changeUserPassword(username, newPassword)) {
                    alert(`Password changed successfully for ${username}`);
                } else {
                    alert("Failed to change password.");
                }
            } else if (newPassword) {
                alert("Password must be at least 4 characters.");
            }
        };
        
        function getPaymentStatus(username, grade, pkgKey) {
            let payments = JSON.parse(localStorage.getItem(STORAGE.PAYMENTS) || '{}');
            return payments[username]?.[grade]?.[pkgKey]?.status || null;
        }
        
        function hasPackageAccess(username, grade, pkgKey) {
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            if (assignments[username]?.[grade]?.[pkgKey]) return true;
            
            let payments = JSON.parse(localStorage.getItem(STORAGE.PAYMENTS) || '{}');
            if (payments[username]?.[grade]?.[pkgKey]?.status === 'approved') return true;
            
            return false;
        }
        
        function submitPayment(username, grade, pkgKey, slipData, ref, date, amount) {
            let payments = JSON.parse(localStorage.getItem(STORAGE.PAYMENTS) || '{}');
            if (!payments[username]) payments[username] = {};
            if (!payments[username][grade]) payments[username][grade] = {};
            payments[username][grade][pkgKey] = { status: 'pending', transactionRef: ref, paymentDate: date, amount: parseInt(amount), slipData: slipData, submittedAt: new Date().toISOString() };
            localStorage.setItem(STORAGE.PAYMENTS, JSON.stringify(payments));
            logActivity(username, 'payment', `Payment for Package - LKR ${amount}`);
        }
        
        function getAttempts(username, grade, pkgKey, paperNum) {
            let attempts = JSON.parse(localStorage.getItem(STORAGE.ATTEMPTS) || '{}');
            return attempts[username]?.[grade]?.[pkgKey]?.[paperNum] || 0;
        }
        
        function incrementAttempt(username, grade, pkgKey, paperNum) {
            let attempts = JSON.parse(localStorage.getItem(STORAGE.ATTEMPTS) || '{}');
            if (!attempts[username]) attempts[username] = {};
            if (!attempts[username][grade]) attempts[username][grade] = {};
            if (!attempts[username][grade][pkgKey]) attempts[username][grade][pkgKey] = {};
            let current = attempts[username][grade][pkgKey][paperNum] || 0;
            attempts[username][grade][pkgKey][paperNum] = current + 1;
            localStorage.setItem(STORAGE.ATTEMPTS, JSON.stringify(attempts));
            return current + 1;
        }
        
        function canAttempt(username, grade, pkgKey, paperNum) {
            return getAttempts(username, grade, pkgKey, paperNum) < MAX_ATTEMPTS;
        }
        
        function resetPaperAttemptsAdmin(username, grade, pkgKey, paperNum) {
            let attempts = JSON.parse(localStorage.getItem(STORAGE.ATTEMPTS) || '{}');
            if (attempts[username]?.[grade]?.[pkgKey]?.[paperNum]) {
                delete attempts[username][grade][pkgKey][paperNum];
                localStorage.setItem(STORAGE.ATTEMPTS, JSON.stringify(attempts));
                logActivity('admin', 'reset_paper', `Reset Paper ${paperNum} for ${username}`);
                return true;
            }
            return false;
        }
        
        function resetPackageAttemptsAdmin(username, grade, pkgKey) {
            let attempts = JSON.parse(localStorage.getItem(STORAGE.ATTEMPTS) || '{}');
            if (attempts[username]?.[grade]?.[pkgKey]) {
                delete attempts[username][grade][pkgKey];
                localStorage.setItem(STORAGE.ATTEMPTS, JSON.stringify(attempts));
                logActivity('admin', 'reset_package', `Reset Package for ${username}`);
                return true;
            }
            return false;
        }
        
        function getQuestions(grade, pkgKey, paper) {
            let all = JSON.parse(localStorage.getItem(STORAGE.QUESTIONS) || '{}');
            return all[grade]?.[pkgKey]?.[paper] || [];
        }
        
        function saveQuestions(grade, pkgKey, paper, questions) {
            let all = JSON.parse(localStorage.getItem(STORAGE.QUESTIONS) || '{}');
            if (!all[grade]) all[grade] = {};
            if (!all[grade][pkgKey]) all[grade][pkgKey] = {};
            all[grade][pkgKey][paper] = questions;
            localStorage.setItem(STORAGE.QUESTIONS, JSON.stringify(all));
            logActivity('admin', 'manage_papers', `Updated Paper ${paper} for Package ${pkgKey}`);
            
            let pkgId = parseInt(pkgKey.replace('pkg_', ''));
            let packages = getAllPackages();
            let pkgIndex = packages.findIndex(p => p.id === pkgId);
            if (pkgIndex !== -1) {
                let maxPaperNum = Math.max(...Object.keys(all[grade][pkgKey]).map(Number), 0);
                if (maxPaperNum > packages[pkgIndex].paperCount) {
                    packages[pkgIndex].paperCount = maxPaperNum;
                    savePackages(packages);
                }
            }
        }
        
        function addNewPaperToPackage(grade, pkgKey, paperNumber) {
            let all = JSON.parse(localStorage.getItem(STORAGE.QUESTIONS) || '{}');
            if (!all[grade]) all[grade] = {};
            if (!all[grade][pkgKey]) all[grade][pkgKey] = {};
            
            if (all[grade][pkgKey][paperNumber]) {
                return { success: false, error: `Paper ${paperNumber} already exists!` };
            }
            
            let pkg = getPackageByKey(pkgKey);
            let pkgName = pkg ? pkg.name : 'Package';
            
            let defaultQuestions = SAMPLE_QS.map((q, idx) => ({
                ...q,
                id: Date.now() + Math.random() * 10000 + paperNumber * 1000 + idx,
                text: q.text + ` (${pkgName} - Paper ${paperNumber})`
            }));
            
            all[grade][pkgKey][paperNumber] = defaultQuestions;
            localStorage.setItem(STORAGE.QUESTIONS, JSON.stringify(all));
            
            let pkgId = parseInt(pkgKey.replace('pkg_', ''));
            let packages = getAllPackages();
            let pkgIndex = packages.findIndex(p => p.id === pkgId);
            if (pkgIndex !== -1) {
                let currentCount = Object.keys(all[grade][pkgKey]).length;
                if (currentCount > packages[pkgIndex].paperCount) {
                    packages[pkgIndex].paperCount = currentCount;
                    savePackages(packages);
                }
            }
            
            logActivity('admin', 'add_new_paper', `Added new Paper ${paperNumber} to Grade ${grade} Package ${pkgKey}`);
            return { success: true, message: `Paper ${paperNumber} created successfully with 10 default questions!` };
        }
        
        function deleteEntirePaper(grade, pkgKey, paper) {
            let all = JSON.parse(localStorage.getItem(STORAGE.QUESTIONS) || '{}');
            if (all[grade] && all[grade][pkgKey] && all[grade][pkgKey][paper]) {
                delete all[grade][pkgKey][paper];
                localStorage.setItem(STORAGE.QUESTIONS, JSON.stringify(all));
                logActivity('admin', 'delete_paper', `Deleted Paper ${paper} from Grade ${grade} Package ${pkgKey}`);
                return true;
            }
            return false;
        }
        
        function savePaperScore(username, grade, pkgKey, paperNum, score, totalQuestions, attemptNumber) {
            let scores = JSON.parse(localStorage.getItem(STORAGE.PAPER_SCORES) || '[]');
            scores.push({ id: Date.now() + Math.random(), username, grade, pkgKey, paperNum, score, totalQuestions, percentage: Math.round((score / totalQuestions) * 100), attemptNumber, timestamp: new Date().toISOString() });
            while (scores.length > 2000) scores.shift();
            localStorage.setItem(STORAGE.PAPER_SCORES, JSON.stringify(scores));
        }
        
        function saveAnswerRecord(username, grade, pkgKey, paperNum, questionId, isCorrect, selectedOption, correctOption) {
            let records = JSON.parse(localStorage.getItem(STORAGE.ANSWER_RECORDS) || '[]');
            records.push({ id: Date.now() + Math.random(), username, grade, pkgKey, paperNum, questionId, isCorrect, selectedOption, correctOption, timestamp: new Date().toISOString() });
            while (records.length > 50000) records.shift();
            localStorage.setItem(STORAGE.ANSWER_RECORDS, JSON.stringify(records));
        }
        
        function getAllStudentsList() { return JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || '{}'); }
        
        function createAccount(username, password, grade) {
            let students = getAllStudentsList();
            if (students[username]) return { success: false, error: "Username already exists!" };
            if (username.length < 3) return { success: false, error: "Username must be at least 3 characters!" };
            if (password.length < 4) return { success: false, error: "Password must be at least 4 characters!" };
            students[username] = { username, password, grade: parseInt(grade), createdAt: new Date().toISOString(), lastLogin: null, loginCount: 0 };
            localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(students));
            logActivity('admin', 'create_account', `Created account for ${username} (Grade ${grade})`);
            logAccountCreation(username, grade, 'admin');
            return { success: true, user: students[username] };
        }
        
        function login(username, password, grade) {
            let students = getAllStudentsList();
            if (!students[username]) return { success: false, error: "Username not found! Contact admin." };
            if (students[username].password !== password) return { success: false, error: "Wrong password!" };
            if (students[username].grade !== parseInt(grade)) return { success: false, error: `This account is for Grade ${students[username].grade}` };
            const sessionResult = registerSession(username, grade);
            students[username].lastLogin = new Date().toISOString();
            students[username].loginCount = (students[username].loginCount || 0) + 1;
            localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(students));
            logActivity(username, 'login', `Logged into Grade ${grade}${sessionResult.wasConflict ? ' (previous session terminated)' : ''}`);
            return { success: true, user: students[username], wasConflict: sessionResult.wasConflict };
        }
        
        function initSampleData() {
            let packages = getAllPackages();
            if (packages.length === 0) {
                createPackage("General Science Pack 1", 5, 1500, 10);
                createPackage("Advanced Science Pack", 8, 2500, 11);
                createPackage("Biology Special", 4, 1200, 10);
                createPackage("Physics Focus", 6, 2000, 11);
                console.log("Sample packages created");
            }
            
            if (!localStorage.getItem(STORAGE.QUESTIONS)) {
                localStorage.setItem(STORAGE.QUESTIONS, JSON.stringify({}));
            }
            
            // Create sample student for testing
            let students = getAllStudentsList();
            if (Object.keys(students).length === 0) {
                createAccount("student1", "pass123", 10);
                createAccount("student2", "pass123", 11);
                console.log("Sample accounts created - student1 (grade 10, pass: pass123), student2 (grade 11, pass: pass123)");
            }
        }
        
        function getSessionId() {
            let sessionId = sessionStorage.getItem('lms_session_id');
            if (!sessionId) {
                sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 16);
                sessionStorage.setItem('lms_session_id', sessionId);
            }
            return sessionId;
        }
        
        function getDeviceInfo() {
            const ua = navigator.userAgent;
            let deviceType = 'Desktop';
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) deviceType = 'Tablet';
            else if (/(Mobile|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile)/i.test(ua)) deviceType = 'Mobile';
            let browser = 'Unknown';
            if (ua.includes('Chrome')) browser = 'Chrome';
            else if (ua.includes('Firefox')) browser = 'Firefox';
            else if (ua.includes('Safari')) browser = 'Safari';
            else if (ua.includes('Edge')) browser = 'Edge';
            return { deviceType, browser, ua: ua.substring(0, 100) };
        }
        
        function registerSession(username, grade) {
            let sessions = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SESSIONS) || '{}');
            const deviceInfo = getDeviceInfo();
            const sessionId = getSessionId();
            const now = new Date().toISOString();
            if (sessions[username] && sessions[username].sessionId !== sessionId) {
                sessions[username] = { sessionId: sessionId, grade: grade, deviceInfo: deviceInfo, loginTime: now, lastActive: now };
                localStorage.setItem(STORAGE.ACTIVE_SESSIONS, JSON.stringify(sessions));
                return { success: true, wasConflict: true };
            } else {
                sessions[username] = { sessionId: sessionId, grade: grade, deviceInfo: deviceInfo, loginTime: now, lastActive: now };
                localStorage.setItem(STORAGE.ACTIVE_SESSIONS, JSON.stringify(sessions));
                return { success: true, wasConflict: false };
            }
        }
        
        function validateSession(username) {
            if (!username) return true;
            let sessions = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SESSIONS) || '{}');
            const currentSessionId = getSessionId();
            if (sessions[username] && sessions[username].sessionId === currentSessionId) {
                sessions[username].lastActive = new Date().toISOString();
                localStorage.setItem(STORAGE.ACTIVE_SESSIONS, JSON.stringify(sessions));
                return true;
            }
            return false;
        }
        
        function removeSession(username) {
            let sessions = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SESSIONS) || '{}');
            if (sessions[username]) { delete sessions[username]; localStorage.setItem(STORAGE.ACTIVE_SESSIONS, JSON.stringify(sessions)); }
        }
        
        function getAllActiveSessions() { return JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SESSIONS) || '{}'); }
        
        function startSessionValidation() {
            if (sessionCheckInterval) clearInterval(sessionCheckInterval);
            sessionCheckInterval = setInterval(() => {
                if (currentUser && !validateSession(currentUser.username)) {
                    if (quizActive) { if (timer) clearInterval(timer); quizActive = false; }
                    currentUser = null; currentGrade = null;
                    document.getElementById('mainNav').classList.add('hidden');
                    document.getElementById('sessionExpiredModal').classList.remove('hidden');
                    document.querySelectorAll('#packagesPage, #papersPage, #quizPage, #resultsPage, #profilePage, #progressPage').forEach(el => el.classList.add('hidden'));
                    document.getElementById('loginPage').classList.remove('hidden');
                }
            }, 5000);
        }
        
        function logActivity(username, type, details) {
            let a = JSON.parse(localStorage.getItem(STORAGE.ACTIVITY) || '[]');
            a.unshift({ id: Date.now(), username, type, details, timestamp: new Date().toISOString() });
            while (a.length > 500) a.pop();
            localStorage.setItem(STORAGE.ACTIVITY, JSON.stringify(a));
        }
        
        function logAccountCreation(username, grade, createdBy) {
            let logs = JSON.parse(localStorage.getItem(STORAGE.ACCOUNT_LOGS) || '[]');
            logs.unshift({ id: Date.now(), username, grade, createdBy, createdAt: new Date().toISOString() });
            localStorage.setItem(STORAGE.ACCOUNT_LOGS, JSON.stringify(logs));
        }
        
        function getActivities(limit) { return JSON.parse(localStorage.getItem(STORAGE.ACTIVITY) || '[]').slice(0, limit || 100); }
        
        function escapeHtml(str) { return str ? String(str).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])) : ''; }
        
        function loadAdminData() {
            let students = getAllStudentsList();
            document.getElementById('statStudents').innerText = Object.keys(students).length;
            
            let packages = getAllPackages();
            document.getElementById('statActivePkgs').innerText = packages.length;
            
            let scores = JSON.parse(localStorage.getItem(STORAGE.PAPER_SCORES) || '[]');
            document.getElementById('statCompletedPapers').innerText = scores.length;
            
            let payments = JSON.parse(localStorage.getItem(STORAGE.PAYMENTS) || '{}');
            let pendingCount = 0;
            for (let u in payments) for (let g in payments[u]) for (let p in payments[u][g]) if (payments[u][g][p].status === 'pending') pendingCount++;
            document.getElementById('statPendingPay').innerText = pendingCount;
            
            let totalLogins = 0;
            for (let [u, data] of Object.entries(students)) totalLogins += (data.loginCount || 0);
            document.getElementById('statTotalLogins').innerText = totalLogins;
            
            document.getElementById('statResetReqs').innerText = JSON.parse(localStorage.getItem(STORAGE.RESETS) || '[]').length;
            
            let totalPapers = 0;
            let allQs = JSON.parse(localStorage.getItem(STORAGE.QUESTIONS) || '{}');
            for (let g in allQs) for (let pkg in allQs[g]) totalPapers += Object.keys(allQs[g][pkg]).length;
            document.getElementById('statTotalPapers').innerText = totalPapers;
            
            let studentsHtml = '';
            for (let [username, data] of Object.entries(students)) {
                studentsHtml += `<div class="admin-card bg-white border rounded-lg p-4">
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold text-lg">${escapeHtml(username)}</span>
                            <span class="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded ml-2">Grade ${data.grade}</span>
                            <div class="text-xs text-gray-400 mt-1">Joined: ${new Date(data.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div class="text-right">
                            <div>🔑 Logins: ${data.loginCount || 0}</div>
                            <div class="text-xs">Last: ${data.lastLogin ? new Date(data.lastLogin).toLocaleDateString() : 'Never'}</div>
                        </div>
                    </div>
                </div>`;
            }
            document.getElementById('adminStudentsPanel').innerHTML = studentsHtml || '<div class="text-center py-8 text-gray-500">No students found</div>';
            
            loadAccountRecordsTable();
            refreshPackagesList();
            updateAssignDropdowns();
            updateStudentAssignmentsList();
            updatePackageSelectors();
            
            let recent = getActivities(20);
            document.getElementById('recentActivityList').innerHTML = recent.map(a => `<div class="p-3 bg-gray-50 rounded-lg"><div class="flex justify-between"><span class="font-bold">${escapeHtml(a.username)}</span><span class="text-xs">${new Date(a.timestamp).toLocaleString()}</span></div><div class="text-sm">${escapeHtml(a.details)}</div></div>`).join('') || '<p class="text-center">No activity</p>';
            
            let topStudents = getTopStudents();
            document.getElementById('topStudentsList').innerHTML = topStudents.map((s, i) => `<div class="flex justify-between p-2 bg-gray-50 rounded"><span>#${i+1} ${s.name}</span><span class="font-bold">${s.attempts} attempts</span></div>`).join('') || '<p class="text-center">No data</p>';
            
            document.getElementById('adminActivityPanel').innerHTML = getActivities(200).map(a => `<div class="p-3 bg-white border rounded"><div class="flex justify-between"><span class="font-bold">${escapeHtml(a.username)}</span><span class="text-xs">${new Date(a.timestamp).toLocaleString()}</span></div><div class="text-sm">${escapeHtml(a.details)}</div></div>`).join('');
        }
        
        function getTopStudents() {
            let attempts = JSON.parse(localStorage.getItem(STORAGE.ATTEMPTS) || '{}');
            let studentData = {};
            for (let u in attempts) {
                let total = 0;
                for (let g in attempts[u]) for (let p in attempts[u][g]) for (let paper in attempts[u][g][p]) total += attempts[u][g][p][paper];
                if (total > 0) studentData[u] = total;
            }
            return Object.entries(studentData).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, attempts]) => ({ name, attempts }));
        }
        
        function loadAccountRecordsTable() {
            let students = getAllStudentsList();
            let tbody = document.getElementById('accountRecordsTable');
            if (Object.keys(students).length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">No accounts created yet</td></table>';
                return;
            }
            let index = 1;
            tbody.innerHTML = '';
            for (let [username, data] of Object.entries(students)) {
                let row = document.createElement('tr');
                row.className = 'border-b hover:bg-green-50';
                row.innerHTML = `<td class="px-4 py-3">${index++}</td>
                    <td class="px-4 py-3 font-medium">${escapeHtml(username)}</td>
                    <td class="px-4 py-3"><span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Grade ${data.grade}</span></td>
                    <td class="px-4 py-3">admin</td>
                    <td class="px-4 py-3 text-sm">${new Date(data.createdAt).toLocaleString()}</td>
                    <td class="px-4 py-3 text-sm">${data.lastLogin ? new Date(data.lastLogin).toLocaleString() : 'Never'}</td>
                    <td class="px-4 py-3 text-center"><span class="font-bold text-blue-600">${data.loginCount || 0}</span></td>`;
                tbody.appendChild(row);
            }
        }
        
        function refreshPackagesList() {
            let packages = getAllPackages();
            let container = document.getElementById('allPackagesList');
            if (packages.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-500">No packages created yet. Create one above!</div>';
            } else {
                container.innerHTML = packages.map(p => `<div class="bg-white border rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <div class="font-bold text-lg">📦 ${escapeHtml(p.name)}</div>
                        <div class="text-sm text-gray-500">Grade ${p.grade} | ${p.paperCount} papers | LKR ${p.fee}</div>
                        <div class="text-xs text-gray-400">Created: ${new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="if(window.deletePackageHandler) deletePackageHandler(${p.id})" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">🗑️ Delete</button>
                    </div>
                </div>`).join('');
            }
        }
        
        window.deletePackageHandler = function(pkgId) {
            if (confirm("Delete this package? This will remove all questions and assignments for this package.")) {
                deletePackage(pkgId);
                refreshPackagesList();
                updateAssignDropdowns();
                updateStudentAssignmentsList();
                updatePackageSelectors();
                loadAdminData();
                alert("Package deleted!");
            }
        };
        
        function updateAssignDropdowns() {
            let students = getAllStudentsList();
            let packages = getAllPackages();
            
            let assignStudentSelect = document.getElementById('assignPkgStudentSelect');
            if (assignStudentSelect) {
                assignStudentSelect.innerHTML = '<option value="">-- Select Student --</option>';
                for (let [username, data] of Object.entries(students)) {
                    assignStudentSelect.innerHTML += `<option value="${username}|${data.grade}">${username} (Grade ${data.grade})</option>`;
                }
            }
            
            let assignPkgSelect = document.getElementById('assignPkgSelect');
            if (assignPkgSelect) {
                assignPkgSelect.innerHTML = '<option value="">-- Select Package --</option>';
                for (let pkg of packages) {
                    assignPkgSelect.innerHTML += `<option value="${pkg.id}">${escapeHtml(pkg.name)} (Grade ${pkg.grade}) - LKR ${pkg.fee}</option>`;
                }
            }
            
            let resetStudentSelect = document.getElementById('resetStudentSelect');
            if (resetStudentSelect) {
                resetStudentSelect.innerHTML = '<option value="">-- Select Student --</option>';
                for (let [username, data] of Object.entries(students)) {
                    resetStudentSelect.innerHTML += `<option value="${username}|${data.grade}">${username} (Grade ${data.grade})</option>`;
                }
            }
            
            let resetPackageStudentSelect = document.getElementById('resetPackageStudentSelect');
            if (resetPackageStudentSelect) {
                resetPackageStudentSelect.innerHTML = '<option value="">-- Select Student --</option>';
                for (let [username, data] of Object.entries(students)) {
                    resetPackageStudentSelect.innerHTML += `<option value="${username}|${data.grade}">${username} (Grade ${data.grade})</option>`;
                }
            }
        }
        
        function updatePackageSelectors() {
            let packages = getAllPackages();
            
            let bulkPackageSelect = document.getElementById('bulkPackageSelect');
            if (bulkPackageSelect) {
                bulkPackageSelect.innerHTML = '';
                for (let pkg of packages) {
                    bulkPackageSelect.innerHTML += `<option value="pkg_${pkg.id}">${escapeHtml(pkg.name)} (Grade ${pkg.grade})</option>`;
                }
            }
            
            let editPackageSelect = document.getElementById('editPackageSelect');
            if (editPackageSelect) {
                editPackageSelect.innerHTML = '';
                for (let pkg of packages) {
                    editPackageSelect.innerHTML += `<option value="pkg_${pkg.id}">${escapeHtml(pkg.name)} (Grade ${pkg.grade})</option>`;
                }
            }
            
            let addPaperPackageSelect = document.getElementById('addPaperPackageSelect');
            if (addPaperPackageSelect) {
                addPaperPackageSelect.innerHTML = '';
                for (let pkg of packages) {
                    addPaperPackageSelect.innerHTML += `<option value="pkg_${pkg.id}">${escapeHtml(pkg.name)} (Grade ${pkg.grade})</option>`;
                }
            }
            
            let resetPackageSelect = document.getElementById('resetPackageSelect');
            if (resetPackageSelect) {
                resetPackageSelect.innerHTML = '';
                for (let pkg of packages) {
                    resetPackageSelect.innerHTML += `<option value="pkg_${pkg.id}">${escapeHtml(pkg.name)} (Grade ${pkg.grade})</option>`;
                }
            }
            
            let resetPackagePkgSelect = document.getElementById('resetPackagePkgSelect');
            if (resetPackagePkgSelect) {
                resetPackagePkgSelect.innerHTML = '';
                for (let pkg of packages) {
                    resetPackagePkgSelect.innerHTML += `<option value="pkg_${pkg.id}">${escapeHtml(pkg.name)} (Grade ${pkg.grade})</option>`;
                }
            }
            
            let insightPackageSelect = document.getElementById('insightPackageSelect');
            if (insightPackageSelect) {
                insightPackageSelect.innerHTML = '<option value="">-- Select Package --</option>';
                for (let pkg of packages) {
                    insightPackageSelect.innerHTML += `<option value="pkg_${pkg.id}">${escapeHtml(pkg.name)} (Grade ${pkg.grade})</option>`;
                }
            }
        }
        
        function updatePaperDropdowns() {
            let editPkgKey = document.getElementById('editPackageSelect').value;
            if (editPkgKey) {
                let pkg = getPackageByKey(editPkgKey);
                let paperLimit = pkg ? pkg.paperCount : 0;
                let editPaperSelect = document.getElementById('editPaperSelect');
                if (editPaperSelect) {
                    editPaperSelect.innerHTML = '';
                    for (let i = 1; i <= paperLimit; i++) {
                        editPaperSelect.innerHTML += `<option value="${i}">Paper ${i}</option>`;
                    }
                }
            }
            
            let bulkPkgKey = document.getElementById('bulkPackageSelect').value;
            if (bulkPkgKey) {
                let pkg = getPackageByKey(bulkPkgKey);
                let paperLimit = pkg ? pkg.paperCount : 0;
                let bulkPaperSelect = document.getElementById('bulkPaperSelect');
                if (bulkPaperSelect) {
                    bulkPaperSelect.innerHTML = '';
                    for (let i = 1; i <= paperLimit; i++) {
                        bulkPaperSelect.innerHTML += `<option value="${i}">Paper ${i}</option>`;
                    }
                }
            }
            
            let resetPkgKey = document.getElementById('resetPackageSelect').value;
            if (resetPkgKey) {
                let pkg = getPackageByKey(resetPkgKey);
                let paperLimit = pkg ? pkg.paperCount : 0;
                let resetPaperSelect = document.getElementById('resetPaperSelect');
                if (resetPaperSelect) {
                    resetPaperSelect.innerHTML = '';
                    for (let i = 1; i <= paperLimit; i++) {
                        resetPaperSelect.innerHTML += `<option value="${i}">Paper ${i}</option>`;
                    }
                }
            }
        }
        
        function updateStudentAssignmentsList() {
            let assignments = JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}');
            let packages = getAllPackages();
            let container = document.getElementById('studentAssignmentsList');
            if (Object.keys(assignments).length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-500">No packages assigned yet</div>';
                return;
            }
            container.innerHTML = '';
            for (let [username, grades] of Object.entries(assignments)) {
                for (let [grade, pkgs] of Object.entries(grades)) {
                    let pkgList = [];
                    for (let key in pkgs) {
                        let pkg = getPackageByKey(key);
                        if (pkg) {
                            pkgList.push(`📦 ${pkg.name}`);
                        } else {
                            pkgList.push(`Package: ${key}`);
                        }
                    }
                    if (pkgList.length > 0) {
                        container.innerHTML += `<div class="bg-white rounded-lg p-3 border"><div class="flex justify-between items-center"><div><span class="font-bold">${username}</span> <span class="text-sm text-gray-500">(Grade ${grade})</span><div class="text-xs text-green-600 mt-1">Assigned: ${pkgList.join(', ')}</div></div></div></div>`;
                    }
                }
            }
        }
        
        function showPackages() {
            document.querySelectorAll('#loginPage, #profilePage, #progressPage, #packagesPage, #papersPage, #quizPage, #resultsPage').forEach(el => el.classList.add('hidden'));
            document.getElementById('packagesPage').classList.remove('hidden');
            document.getElementById('gradeLabel').innerText = currentGrade;
            document.getElementById('userName').innerText = currentUser.username;
            let grid = document.getElementById('packagesGrid');
            grid.innerHTML = '';
            let userPackages = getUserPackages(currentUser.username, currentGrade);
            
            if (userPackages.length === 0) {
                grid.innerHTML = `<div class="col-span-full text-center py-12">
                    <div class="text-6xl mb-4">📦</div>
                    <h3 class="text-xl font-bold text-gray-700">No Packages Assigned Yet</h3>
                    <p class="text-gray-500 mt-2">Contact your admin to get access to learning packages.</p>
                </div>`;
                return;
            }
            
            for (let pkg of userPackages) {
                let div = document.createElement('div');
                let bgClass = pkg.hasAccess ? 'border-green-500 bg-green-50' : (pkg.isPending ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white');
                div.className = `package-card rounded-xl p-5 text-center border-2 transition ${bgClass}`;
                let accessText = pkg.hasAccess ? '✓ Purchased' : (pkg.isPending ? '⏳ Pending Verification' : '🔒 Locked');
                div.innerHTML = `<div class="text-4xl mb-2">📦</div>
                    <div class="text-xl font-bold">${escapeHtml(pkg.name)}</div>
                    <div class="text-sm text-gray-500">${pkg.paperCount} papers</div>
                    <div class="text-lg font-bold text-green-700 mt-2">LKR ${pkg.fee}</div>
                    <div class="text-xs text-blue-500 mt-1">Each paper: ${MAX_ATTEMPTS} attempts</div>
                    <div class="mt-3 text-sm font-semibold">${accessText}</div>`;
                let btn = document.createElement('button');
                btn.className = `mt-3 w-full text-white px-4 py-2 rounded-lg font-semibold ${pkg.hasAccess ? 'bg-green-600 hover:bg-green-700' : (pkg.isPending ? 'bg-yellow-600' : 'bg-gray-400 cursor-not-allowed')}`;
                btn.innerText = pkg.hasAccess ? 'View Papers' : (pkg.isPending ? 'Check Status' : `Purchase (LKR ${pkg.fee})`);
                btn.onclick = () => {
                    if (pkg.hasAccess) {
                        currentPackageKey = pkg.key;
                        showPapers();
                    } else if (pkg.isPending) {
                        alert('Payment pending verification.');
                    } else {
                        showPaymentModal(pkg);
                    }
                };
                if (!pkg.hasAccess && !pkg.isPending) btn.disabled = true;
                div.appendChild(btn);
                grid.appendChild(div);
            }
        }
        
        function showPapers() {
            document.getElementById('packagesPage').classList.add('hidden');
            document.getElementById('papersPage').classList.remove('hidden');
            
            let pkg = getPackageByKey(currentPackageKey);
            let paperLimit = pkg ? pkg.paperCount : 0;
            document.getElementById('currentPkgName').innerText = pkg ? pkg.name : 'Package';
            
            let attempted = 0;
            for (let i = 1; i <= paperLimit; i++) {
                if (getAttempts(currentUser.username, currentGrade, currentPackageKey, i) > 0) attempted++;
            }
            document.getElementById('attemptedPapersCount').innerText = attempted;
            document.getElementById('totalPapersCount').innerText = paperLimit;
            document.getElementById('progressFill').style.width = `${(attempted / paperLimit) * 100}%`;
            
            let grid = document.getElementById('papersGrid');
            grid.innerHTML = '';
            for (let paper = 1; paper <= paperLimit; paper++) {
                let attemptsUsed = getAttempts(currentUser.username, currentGrade, currentPackageKey, paper);
                let remaining = MAX_ATTEMPTS - attemptsUsed;
                let canStart = remaining > 0;
                let div = document.createElement('div');
                div.className = `paper-card relative rounded-xl p-4 text-center border-2 transition ${!canStart ? 'bg-gray-100 border-red-300 opacity-70' : remaining === 1 ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:shadow-md'}`;
                div.innerHTML = `<div class="text-3xl mb-2">📄</div><div class="font-bold text-lg">Paper ${paper}</div><div class="text-xs mt-1 ${!canStart ? 'text-red-600 font-bold' : 'text-gray-500'}">${!canStart ? '❌ NO ATTEMPTS LEFT' : remaining === 1 ? '⚠️ 1 attempt left!' : `✅ ${remaining} attempts left`}</div><div class="text-xs text-blue-500 mt-1">⏰ 1 hour limit</div>`;
                if (canStart) {
                    let btn = document.createElement('button');
                    btn.className = `mt-3 w-full text-white px-3 py-2 rounded-lg text-sm font-semibold ${remaining === 1 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`;
                    btn.innerText = remaining === 1 ? `Start (Last attempt!)` : `Start Paper (${remaining} tries left)`;
                    btn.onclick = () => startPaper(paper);
                    div.appendChild(btn);
                } else {
                    let btn = document.createElement('button');
                    btn.className = `mt-3 w-full bg-gray-400 text-white px-3 py-2 rounded-lg text-sm font-semibold cursor-not-allowed`;
                    btn.innerText = `No attempts left - Contact admin`;
                    btn.onclick = () => alert('No attempts remaining. Contact admin for reset.');
                    div.appendChild(btn);
                }
                grid.appendChild(div);
            }
        }
        
        function startPaper(paperNum) {
            if (!canAttempt(currentUser.username, currentGrade, currentPackageKey, paperNum)) {
                alert(`No attempts left!`);
                return;
            }
            let qs = getQuestions(currentGrade, currentPackageKey, paperNum);
            if (!qs.length) {
                alert("No questions available.");
                return;
            }
            if (!confirm(`⚠️ You have 1 HOUR to complete Paper ${paperNum}!\nThis will use 1 attempt.\n\nProceed?`)) return;
            currentPaper = paperNum;
            currentQuestions = JSON.parse(JSON.stringify(qs));
            userAnswers = {};
            currentIndex = 0;
            timeLeft = TIME_LIMIT_SEC;
            quizActive = true;
            document.getElementById('papersPage').classList.add('hidden');
            document.getElementById('quizPage').classList.remove('hidden');
            document.getElementById('qTotal').innerText = currentQuestions.length;
            startTimer();
            renderQuestion();
        }
        
        function renderQuestion() {
            if (!quizActive || currentIndex >= currentQuestions.length) return;
            let q = currentQuestions[currentIndex];
            const qImgContainer = document.getElementById('questionImageContainer');
            if (q.qImage && q.qImage.trim() !== "") {
                qImgContainer.innerHTML = `<img src="${q.qImage}" alt="Question Image" class="quiz-image mx-auto" onerror="this.style.display='none'">`;
            } else {
                qImgContainer.innerHTML = '';
            }
            document.getElementById('questionText').innerHTML = q.text;
            let selected = userAnswers[q.id] !== undefined ? userAnswers[q.id] : -1;
            let html = '';
            q.options.forEach((opt, idx) => {
                let optImgHtml = (q.optImages && q.optImages[idx] && q.optImages[idx].trim() !== "") ? `<img src="${q.optImages[idx]}" class="option-image inline-block ml-2 align-middle" onerror="this.style.display='none'">` : '';
                html += `<div onclick="window.selectAnswer(${idx})" class="option-card border-2 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition ${selected === idx ? 'selected' : 'border-gray-200 bg-white hover:bg-gray-50'}"><div class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === idx ? 'bg-white border-white' : 'border-gray-400'}">${selected === idx ? '✓' : ''}</div><span>${opt}</span>${optImgHtml}</div>`;
            });
            document.getElementById('optionsContainer').innerHTML = html;
            document.getElementById('qCurrent').innerText = currentIndex + 1;
            document.getElementById('quizProgress').style.width = `${((currentIndex + 1) / currentQuestions.length) * 100}%`;
        }
        
        window.selectAnswer = function(idx) { let q = currentQuestions[currentIndex]; userAnswers[q.id] = idx; renderQuestion(); };
        
        function nextQuestion() {
            let q = currentQuestions[currentIndex];
            if (userAnswers[q.id] === undefined) {
                alert("Please select an answer!");
                return;
            }
            if (currentIndex + 1 < currentQuestions.length) {
                currentIndex++;
                renderQuestion();
            } else finishQuiz();
        }
        
        function prevQuestion() {
            if (currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            }
        }
        
        function startTimer() {
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
                if (!quizActive) return;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    alert("⏰ Time's up!");
                    finishQuiz();
                } else {
                    timeLeft--;
                    let mins = Math.floor(timeLeft / 60);
                    let secs = timeLeft % 60;
                    document.getElementById('timerDisplay').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    if (timeLeft <= 300) document.getElementById('timerDisplay').classList.add('timer-warning');
                }
            }, 1000);
        }
        
        function finishQuiz() {
            if (!quizActive) return;
            quizActive = false;
            if (timer) clearInterval(timer);
            let elapsed = TIME_LIMIT_SEC - timeLeft;
            let correct = 0;
            let details = [];
            for (let q of currentQuestions) {
                let userAns = userAnswers[q.id];
                let isCorrect = (userAns === q.correct);
                if (isCorrect) correct++;
                details.push({ question: q.text, userAnswer: userAns !== undefined ? q.options[userAns] : "No answer", correctAnswer: q.options[q.correct], isCorrect });
                saveAnswerRecord(currentUser.username, currentGrade, currentPackageKey, currentPaper, q.id, isCorrect, userAns, q.correct);
            }
            let percentage = Math.round(correct / currentQuestions.length * 100);
            let newAttemptCount = incrementAttempt(currentUser.username, currentGrade, currentPackageKey, currentPaper);
            let remaining = MAX_ATTEMPTS - newAttemptCount;
            savePaperScore(currentUser.username, currentGrade, currentPackageKey, currentPaper, correct, currentQuestions.length, newAttemptCount);
            quizResult = { correct, total: currentQuestions.length, percentage, elapsed, details, remaining };
            document.getElementById('quizPage').classList.add('hidden');
            document.getElementById('resultsPage').classList.remove('hidden');
            document.getElementById('finalScore').innerHTML = `${correct}/${currentQuestions.length} (${percentage}%)`;
            document.getElementById('timeTakenDisplay').innerHTML = `${Math.floor(elapsed / 60)} min ${elapsed % 60} sec`;
            document.getElementById('attemptsLeftDisplay').innerHTML = remaining > 0 ? `You have ${remaining} attempt(s) remaining.` : `No attempts remaining. Contact admin.`;
            if (typeof canvasConfetti !== 'undefined') canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
        
        function downloadPDF() {
            if (!quizResult) return;
            let container = document.createElement('div');
            let pkg = getPackageByKey(currentPackageKey);
            let pkgDisplay = pkg ? pkg.name : 'Package';
            container.innerHTML = `<div style="padding:20px"><h1 style="color:#2d6a4f">Science with Denuka</h1><p><strong>Score:</strong> ${quizResult.correct}/${quizResult.total} (${quizResult.percentage}%)</p><p><strong>Student:</strong> ${currentUser.username}</p><p><strong>Grade:</strong> ${currentGrade}</p><p><strong>Package:</strong> ${pkgDisplay}</p><p><strong>Paper:</strong> ${currentPaper}</p><p><strong>Time:</strong> ${Math.floor(quizResult.elapsed/60)} min ${quizResult.elapsed%60} sec</p><p><strong>Attempts left:</strong> ${quizResult.remaining}</p><hr>${quizResult.details.map((d,i)=>`<div><strong>Q${i+1}:</strong> ${d.question}<br>Your: ${d.userAnswer}${!d.isCorrect ? `<br>Correct: ${d.correctAnswer}` : ''}</div>`).join('')}</div>`;
            if (typeof html2pdf !== 'undefined') {
                html2pdf().set({ margin: 0.5, filename: `Paper_${currentPaper}_${currentUser.username}.pdf` }).from(container).save();
            } else {
                alert("PDF generation not available");
            }
        }
        
        function downloadAnswers() {
            if (!currentQuestions.length) { alert("No questions"); return; }
            let content = `SCIENCE WITH DENUKA - ANSWER SHEET\nStudent: ${currentUser.username}\nPaper: ${currentPaper}\n\n`;
            currentQuestions.forEach((q, i) => {
                let ans = userAnswers[q.id];
                content += `Q${i+1}: ${q.text}\n   Answer: ${ans !== undefined ? q.options[ans] : "Not answered"}\n\n`;
            });
            let blob = new Blob([content], { type: "text/plain" });
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Paper_${currentPaper}_Answers.txt`;
            a.click();
            URL.revokeObjectURL(blob);
        }
        
        function showPaymentModal(pkg) {
            document.getElementById('payPkgName').innerText = pkg.name;
            document.getElementById('payFeeAmount').innerText = pkg.fee;
            document.getElementById('paymentModal').classList.remove('hidden');
            window.selectedPkg = pkg;
        }
        
        function handlePaymentSubmit() {
            let file = document.getElementById('bankSlipInput').files[0];
            if (!file) { alert("Please upload bank slip"); return; }
            let ref = document.getElementById('transactionRefInput').value;
            let date = document.getElementById('paymentDateInput').value;
            let amount = document.getElementById('amountPaidInput').value;
            if (!ref || !date || !amount) { alert("Please fill all fields"); return; }
            let reader = new FileReader();
            reader.onload = (evt) => {
                submitPayment(currentUser.username, currentGrade, window.selectedPkg.key, evt.target.result, ref, date, amount);
                document.getElementById('paymentModal').classList.add('hidden');
                document.getElementById('waitingModal').classList.remove('hidden');
                document.getElementById('bankSlipInput').value = '';
                document.getElementById('transactionRefInput').value = '';
                document.getElementById('paymentDateInput').value = '';
                document.getElementById('amountPaidInput').value = '';
                showPackages();
                alert("✅ Payment submitted! Awaiting admin approval.");
            };
            reader.readAsDataURL(file);
        }
        
        function loadProgressPage() {
            if (!currentUser) return;
            let html = '';
            let userPackages = getUserPackages(currentUser.username, currentGrade);
            for (let pkg of userPackages) {
                let totalAttempts = 0, maxAttempts = 0;
                for (let i = 1; i <= pkg.paperCount; i++) {
                    totalAttempts += getAttempts(currentUser.username, currentGrade, pkg.key, i);
                    maxAttempts += MAX_ATTEMPTS;
                }
                let remaining = maxAttempts - totalAttempts;
                let percent = maxAttempts ? Math.round(remaining / maxAttempts * 100) : 0;
                html += `<div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex justify-between items-center mb-3"><span class="font-bold text-lg">${escapeHtml(pkg.name)}</span><span class="text-sm font-semibold ${percent > 50 ? 'text-green-600' : percent > 20 ? 'text-yellow-600' : 'text-red-600'}">${percent}% remaining</span></div><div class="w-full bg-gray-200 rounded-full h-3 mb-2"><div class="bg-green-600 h-3 rounded-full" style="width:${percent}%"></div></div><div class="flex justify-between text-sm"><span>Remaining attempts: ${remaining}</span><span>Total: ${maxAttempts}</span></div><div class="text-xs text-gray-400 mt-1">${pkg.paperCount} papers total</div></div>`;
            }
            document.getElementById('progressSummary').innerHTML = html || '<div class="text-center py-8 text-gray-500">No packages assigned yet.</div>';
        }
        
        window.exportAllData = function() {
            let data = { students: getAllStudentsList(), packages: getAllPackages(), assignments: JSON.parse(localStorage.getItem(STORAGE.ASSIGNMENTS) || '{}') };
            let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `science_lms_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            alert('Data exported!');
        };
        
        window.clearAllData = function() {
            if (confirm("Clear all data? This cannot be undone!")) {
                localStorage.clear();
                alert("Cleared. Reloading...");
                location.reload();
            }
        };
        
        function createStudentAccount() {
            let username = document.getElementById('newUsername').value.trim();
            let password = document.getElementById('newPassword').value.trim();
            let gradeRadio = document.querySelector('input[name="newGrade"]:checked');
            let grade = gradeRadio ? gradeRadio.value : null;
            let resultDiv = document.getElementById('createAccountResult');
            if (!username) {
                resultDiv.innerHTML = '<div class="bg-red-100 text-red-700 p-3 rounded">❌ Please enter a username</div>';
                resultDiv.classList.remove('hidden');
                return;
            }
            if (!password) {
                resultDiv.innerHTML = '<div class="bg-red-100 text-red-700 p-3 rounded">❌ Please enter a password</div>';
                resultDiv.classList.remove('hidden');
                return;
            }
            if (!grade) {
                resultDiv.innerHTML = '<div class="bg-red-100 text-red-700 p-3 rounded">❌ Please select a grade</div>';
                resultDiv.classList.remove('hidden');
                return;
            }
            let result = createAccount(username, password, parseInt(grade));
            if (result.success) {
                resultDiv.innerHTML = `<div class="bg-green-100 text-green-700 p-3 rounded">✅ Account created successfully!<br>Username: ${username}<br>Password: ${password}<br>Grade: ${grade}</div>`;
                document.getElementById('newUsername').value = '';
                document.getElementById('newPassword').value = '';
                document.querySelectorAll('input[name="newGrade"]').forEach(r => r.checked = false);
                loadAdminData();
                setTimeout(() => resultDiv.classList.add('hidden'), 5000);
            } else {
                resultDiv.innerHTML = `<div class="bg-red-100 text-red-700 p-3 rounded">❌ ${result.error}</div>`;
            }
            resultDiv.classList.remove('hidden');
        }
        
        function parseExcelAndUpload(file, grade, pkgKey, paper) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
                if (!rows || rows.length < 2) { alert("File is empty!"); return; }
                const headers = rows[0];
                const qCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('question') && !h.toString().toLowerCase().includes('image')));
                const aCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option a') || h.toString().toLowerCase() === 'a'));
                const bCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option b') || h.toString().toLowerCase() === 'b'));
                const cCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option c') || h.toString().toLowerCase() === 'c'));
                const dCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option d') || h.toString().toLowerCase() === 'd'));
                const correctCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('correct') || h.toString().toLowerCase().includes('answer')));
                const qImgCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('question image') || h.toString().toLowerCase().includes('qimage')));
                const optAImgCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option a image') || h.toString().toLowerCase().includes('aimage')));
                const optBImgCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option b image') || h.toString().toLowerCase().includes('bimage')));
                const optCImgCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option c image') || h.toString().toLowerCase().includes('cimage')));
                const optDImgCol = headers.findIndex(h => h && (h.toString().toLowerCase().includes('option d image') || h.toString().toLowerCase().includes('dimage')));
                
                if (qCol === -1 || aCol === -1 || bCol === -1 || cCol === -1 || dCol === -1) { alert("Required columns (Question, Option A-D) not found!"); return; }
                let questions = [];
                for (let i = 1; i < rows.length; i++) {
                    let row = rows[i];
                    let qText = row[qCol] ? String(row[qCol]).trim() : "";
                    let optA = row[aCol] ? String(row[aCol]).trim() : "";
                    let optB = row[bCol] ? String(row[bCol]).trim() : "";
                    let optC = row[cCol] ? String(row[cCol]).trim() : "";
                    let optD = row[dCol] ? String(row[dCol]).trim() : "";
                    if (!qText || !optA || !optB || !optC || !optD) continue;
                    let correct = 0;
                    if (correctCol !== -1 && row[correctCol] !== undefined && row[correctCol] !== "") {
                        let cv = String(row[correctCol]).toLowerCase().trim();
                        if (cv === 'a' || cv === '0') correct = 0;
                        else if (cv === 'b' || cv === '1') correct = 1;
                        else if (cv === 'c' || cv === '2') correct = 2;
                        else if (cv === 'd' || cv === '3') correct = 3;
                    }
                    let qImage = (qImgCol !== -1 && row[qImgCol]) ? String(row[qImgCol]).trim() : "";
                    let optImages = [
                        (optAImgCol !== -1 && row[optAImgCol]) ? String(row[optAImgCol]).trim() : "",
                        (optBImgCol !== -1 && row[optBImgCol]) ? String(row[optBImgCol]).trim() : "",
                        (optCImgCol !== -1 && row[optCImgCol]) ? String(row[optCImgCol]).trim() : "",
                        (optDImgCol !== -1 && row[optDImgCol]) ? String(row[optDImgCol]).trim() : ""
                    ];
                    questions.push({ id: Date.now() + i + Math.random(), text: qText, options: [optA, optB, optC, optD], correct: correct, qImage: qImage, optImages: optImages });
                }
                if (questions.length === 0) { alert("No valid questions found!"); return; }
                if (confirm(`Found ${questions.length} questions. Replace Paper ${paper}?`)) {
                    saveQuestions(parseInt(grade), pkgKey, parseInt(paper), questions);
                    alert(`✅ Uploaded ${questions.length} questions!`);
                    loadQuestionsToEditor();
                }
            };
            reader.readAsArrayBuffer(file);
        }
        
        function loadQuestionsToEditor() {
            let grade = parseInt(document.getElementById('editGradeSelect').value);
            let pkgKey = document.getElementById('editPackageSelect').value;
            let paper = parseInt(document.getElementById('editPaperSelect').value);
            let qs = getQuestions(grade, pkgKey, paper);
            let container = document.getElementById('questionsEditor');
            if (!qs.length) { container.innerHTML = '<div class="text-center py-8 text-gray-500">No questions. Upload Excel or add new.</div>'; return; }
            container.innerHTML = qs.map((q, idx) => `<div class="question-card"><div class="flex justify-between items-center mb-2"><strong class="text-green-800">Q${idx+1}</strong><div><button onclick="window.openEditModal(${q.id}, ${grade}, '${pkgKey}', ${paper})" class="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2">✏️ Edit</button><button onclick="window.deleteQuestion(${q.id}, ${grade}, '${pkgKey}', ${paper})" class="bg-red-600 text-white px-3 py-1 rounded text-sm mr-2">🗑️ Delete</button><button onclick="window.deleteEntirePaperHandler(${grade}, '${pkgKey}', ${paper})" class="bg-orange-600 text-white px-3 py-1 rounded text-sm">🗑️ Delete Entire Paper</button></div></div><p class="font-medium">${escapeHtml(q.text)}</p>${q.qImage ? `<img src="${escapeHtml(q.qImage)}" class="max-h-32 my-2 rounded border" onerror="this.style.display='none'">` : ''}<div class="grid grid-cols-2 gap-2 text-sm mt-2"><div>A. ${escapeHtml(q.options[0])}</div><div>B. ${escapeHtml(q.options[1])}</div><div>C. ${escapeHtml(q.options[2])}</div><div>D. ${escapeHtml(q.options[3])}</div></div><div class="text-sm text-green-700 mt-1">✓ Correct: ${String.fromCharCode(65+q.correct)}</div></div>`).join('');
        }
        
        window.openEditModal = function(qid, grade, pkgKey, paper) {
            let qs = getQuestions(grade, pkgKey, paper);
            let q = qs.find(qq => qq.id === qid);
            if (!q) return;
            currentEditQ = { ...q };
            editGrade = grade;
            editPkgKey = pkgKey;
            editPaper = paper;
            document.getElementById('editQText').value = q.text;
            document.getElementById('editOptA').value = q.options[0];
            document.getElementById('editOptB').value = q.options[1];
            document.getElementById('editOptC').value = q.options[2];
            document.getElementById('editOptD').value = q.options[3];
            document.getElementById('editCorrectAns').value = q.correct;
            document.getElementById('editQImage').value = q.qImage || "";
            document.getElementById('editOptAImg').value = (q.optImages && q.optImages[0]) || "";
            document.getElementById('editOptBImg').value = (q.optImages && q.optImages[1]) || "";
            document.getElementById('editOptCImg').value = (q.optImages && q.optImages[2]) || "";
            document.getElementById('editOptDImg').value = (q.optImages && q.optImages[3]) || "";
            document.getElementById('editQuestionModal').classList.remove('hidden');
        };
        
        function saveEditedQuestion() {
            if (!currentEditQ) return;
            let updated = { ...currentEditQ, text: document.getElementById('editQText').value, options: [document.getElementById('editOptA').value, document.getElementById('editOptB').value, document.getElementById('editOptC').value, document.getElementById('editOptD').value], correct: parseInt(document.getElementById('editCorrectAns').value), qImage: document.getElementById('editQImage').value, optImages: [document.getElementById('editOptAImg').value, document.getElementById('editOptBImg').value, document.getElementById('editOptCImg').value, document.getElementById('editOptDImg').value] };
            let qs = getQuestions(editGrade, editPkgKey, editPaper);
            let idx = qs.findIndex(q => q.id === currentEditQ.id);
            if (idx !== -1) qs[idx] = updated;
            saveQuestions(editGrade, editPkgKey, editPaper, qs);
            loadQuestionsToEditor();
            document.getElementById('editQuestionModal').classList.add('hidden');
            currentEditQ = null;
            alert("✅ Question updated!");
        }
        
        window.deleteQuestion = function(qid, grade, pkgKey, paper) {
            if (!confirm("Delete this question?")) return;
            let qs = getQuestions(grade, pkgKey, paper);
            qs = qs.filter(q => q.id !== qid);
            saveQuestions(grade, pkgKey, paper, qs);
            loadQuestionsToEditor();
            alert("Question deleted!");
        };
        
        window.deleteEntirePaperHandler = function(grade, pkgKey, paper) {
            if (confirm(`⚠️ WARNING: This will delete ALL questions in Paper ${paper}. This action cannot be undone! Continue?`)) {
                if (deleteEntirePaper(grade, pkgKey, paper)) {
                    alert(`✅ Paper ${paper} has been deleted.`);
                    loadQuestionsToEditor();
                    updatePaperDropdowns();
                } else {
                    alert("Failed to delete paper.");
                }
            }
        };
        
        function addNewQuestion() {
            let grade = parseInt(document.getElementById('editGradeSelect').value);
            let pkgKey = document.getElementById('editPackageSelect').value;
            let paper = parseInt(document.getElementById('editPaperSelect').value);
            let qs = getQuestions(grade, pkgKey, paper);
            qs.push({ id: Date.now(), text: "New question - Click Edit", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0, qImage: "", optImages: ["","","",""] });
            saveQuestions(grade, pkgKey, paper, qs);
            loadQuestionsToEditor();
            alert("New question added!");
        }
        
        function handleAddNewPaper() {
            let grade = parseInt(document.getElementById('addPaperGradeSelect').value);
            let pkgKey = document.getElementById('addPaperPackageSelect').value;
            let paperNum = parseInt(document.getElementById('newPaperNumber').value);
            
            if (!paperNum || paperNum < 1) {
                alert("Please enter a valid paper number (1 or greater)");
                return;
            }
            
            let result = addNewPaperToPackage(grade, pkgKey, paperNum);
            
            if (result.success) {
                alert(result.message);
                updatePaperDropdowns();
                let currentEditPkg = document.getElementById('editPackageSelect').value;
                if (currentEditPkg === pkgKey) {
                    loadQuestionsToEditor();
                }
            } else {
                alert(result.error);
            }
        }
        
        function assignPackageToStudentHandler() {
            let studentVal = document.getElementById('assignPkgStudentSelect').value;
            let pkgId = document.getElementById('assignPkgSelect').value;
            if (!studentVal) { alert("Select a student"); return; }
            if (!pkgId) { alert("Select a package"); return; }
            let [username, grade] = studentVal.split('|');
            let pkg = getAllPackages().find(p => p.id == parseInt(pkgId));
            if (!pkg) { alert("Package not found"); return; }
            if (pkg.grade != parseInt(grade)) { alert(`This package is for Grade ${pkg.grade}, but student is Grade ${grade}`); return; }
            assignPackageToStudent(username, grade, pkg.id);
            alert(`✅ Package "${pkg.name}" assigned to ${username}!`);
            updateStudentAssignmentsList();
            if (currentUser && currentUser.username === username && currentGrade == grade) showPackages();
        }
        
        function resetPaperAdmin() {
            let studentVal = document.getElementById('resetStudentSelect').value;
            if (!studentVal) { alert("Select a student"); return; }
            let [username, grade] = studentVal.split('|');
            let pkgKey = document.getElementById('resetPackageSelect').value;
            let paperNum = parseInt(document.getElementById('resetPaperSelect').value);
            if (resetPaperAttemptsAdmin(username, parseInt(grade), pkgKey, paperNum)) {
                alert(`✅ Paper ${paperNum} reset for ${username}!`);
            } else alert(`No attempts found for this paper.`);
        }
        
        function resetPackageAdmin() {
            let studentVal = document.getElementById('resetPackageStudentSelect').value;
            if (!studentVal) { alert("Select a student"); return; }
            let [username, grade] = studentVal.split('|');
            let pkgKey = document.getElementById('resetPackagePkgSelect').value;
            if (resetPackageAttemptsAdmin(username, parseInt(grade), pkgKey)) {
                alert(`✅ Package reset for ${username}!`);
            } else alert(`No attempts found for this package.`);
        }
        
        function createNewPackage() {
            let name = document.getElementById('newPkgName').value.trim();
            let paperCount = document.getElementById('newPkgPapers').value;
            let fee = document.getElementById('newPkgFee').value;
            let grade = document.getElementById('newPkgGrade').value;
            let resultDiv = document.getElementById('packageCreateResult');
            
            if (!name) { resultDiv.innerHTML = '<div class="bg-red-100 text-red-700 p-2 rounded">❌ Please enter package name</div>'; resultDiv.classList.remove('hidden'); return; }
            if (!paperCount || paperCount < 1) { resultDiv.innerHTML = '<div class="bg-red-100 text-red-700 p-2 rounded">❌ Please enter valid number of papers (at least 1)</div>'; resultDiv.classList.remove('hidden'); return; }
            if (!fee || fee < 0) { resultDiv.innerHTML = '<div class="bg-red-100 text-red-700 p-2 rounded">❌ Please enter valid fee</div>'; resultDiv.classList.remove('hidden'); return; }
            
            createPackage(name, paperCount, fee, grade);
            refreshPackagesList();
            updateAssignDropdowns();
            updatePackageSelectors();
            document.getElementById('newPkgName').value = '';
            document.getElementById('newPkgPapers').value = '';
            document.getElementById('newPkgFee').value = '';
            resultDiv.innerHTML = '<div class="bg-green-100 text-green-700 p-2 rounded">✅ Package created successfully!</div>';
            resultDiv.classList.remove('hidden');
            setTimeout(() => resultDiv.classList.add('hidden'), 3000);
            loadAdminData();
        }
        
        // ==================== EVENT LISTENERS ====================
        document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM fully loaded - Initializing system...");
            
            // Initialize sample data
            initSampleData();
            
            // ===== USER PROFILE SEARCH =====
            const adminUserSearchBtn = document.getElementById('adminUserSearchBtn');
            const adminUserSearchInput = document.getElementById('adminUserSearchInput');
            
            if (adminUserSearchBtn) {
                adminUserSearchBtn.onclick = function() {
                    let username = adminUserSearchInput.value.trim();
                    if (!username) {
                        alert("Please enter a username to search");
                        return;
                    }
                    renderUserProfileView(username);
                };
            }
            
            if (adminUserSearchInput) {
                adminUserSearchInput.onkeypress = function(e) {
                    if (e.key === 'Enter') {
                        let username = adminUserSearchInput.value.trim();
                        if (username) renderUserProfileView(username);
                    }
                };
            }
            
            // ===== LOGIN PAGE BUTTONS =====
            let selectedLoginGrade = null;
            const grade10Btn = document.getElementById('loginGrade10');
            const grade11Btn = document.getElementById('loginGrade11');
            const loginSubmit = document.getElementById('loginSubmitBtn');
            
            if (grade10Btn) {
                grade10Btn.onclick = function(e) {
                    e.preventDefault();
                    selectedLoginGrade = 10;
                    grade10Btn.classList.add('selected');
                    if (grade11Btn) grade11Btn.classList.remove('selected');
                    document.getElementById('selectedLoginGrade').value = "10";
                    loginSubmit.disabled = false;
                    loginSubmit.className = "w-full bg-green-700 text-white font-bold py-3 rounded-xl";
                };
            }
            
            if (grade11Btn) {
                grade11Btn.onclick = function(e) {
                    e.preventDefault();
                    selectedLoginGrade = 11;
                    grade11Btn.classList.add('selected');
                    if (grade10Btn) grade10Btn.classList.remove('selected');
                    document.getElementById('selectedLoginGrade').value = "11";
                    loginSubmit.disabled = false;
                    loginSubmit.className = "w-full bg-green-700 text-white font-bold py-3 rounded-xl";
                };
            }
            
            if (loginSubmit) {
                loginSubmit.onclick = function() {
                    let username = document.getElementById('loginUsername').value.trim();
                    let password = document.getElementById('loginPassword').value;
                    if (!selectedLoginGrade) { alert("Please select a grade first!"); return; }
                    let result = login(username, password, selectedLoginGrade);
                    if (result.success) {
                        currentUser = result.user;
                        currentGrade = selectedLoginGrade;
                        document.getElementById('mainNav').classList.remove('hidden');
                        showPackages();
                        startSessionValidation();
                        if (result.wasConflict) alert("⚠️ You were logged in from another device. That session has been terminated.");
                    } else { alert(result.error); }
                };
            }
            
            // ===== ADMIN PORTAL BUTTON =====
            const adminPortalBtn = document.getElementById('adminPortalBtn');
            const adminModal = document.getElementById('adminModal');
            const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
            const adminPasswordInput = document.getElementById('adminPasswordInput');
            const adminLoginBtn = document.getElementById('adminLoginBtn');
            const adminPanelContent = document.getElementById('adminPanelContent');
            let adminLogged = false;
            
            if (adminPortalBtn) {
                adminPortalBtn.onclick = function() { adminModal.classList.remove('hidden'); };
            }
            
            if (closeAdminModalBtn) {
                closeAdminModalBtn.onclick = function() { 
                    adminModal.classList.add('hidden'); 
                    adminPanelContent.classList.add('hidden'); 
                    adminPasswordInput.value = ''; 
                    adminLogged = false; 
                    if(adminLoginBtn) adminLoginBtn.innerHTML = 'Login';
                    document.getElementById('userProfileView').classList.add('hidden');
                    document.getElementById('adminUserSearchInput').value = '';
                };
            }
            
            if (adminLoginBtn) {
                adminLoginBtn.onclick = function() {
                    if (!adminLogged && adminPasswordInput.value === 'Admin2025') {
                        adminLogged = true;
                        adminPanelContent.classList.remove('hidden');
                        adminLoginBtn.innerHTML = 'Logout';
                        loadAdminData();
                    } else if (adminLogged) {
                        adminLogged = false;
                        adminPanelContent.classList.add('hidden');
                        adminLoginBtn.innerHTML = 'Login';
                        adminPasswordInput.value = '';
                        document.getElementById('userProfileView').classList.add('hidden');
                        document.getElementById('adminUserSearchInput').value = '';
                    } else { alert("Wrong password"); }
                };
            }
            
            // ===== NAVIGATION BUTTONS =====
            const navHome = document.getElementById('navHome');
            const navPackages = document.getElementById('navPackages');
            const navProfile = document.getElementById('navProfile');
            const navProgress = document.getElementById('navProgress');
            const navLogout = document.getElementById('navLogout');
            
            if (navHome) navHome.onclick = () => currentUser && showPackages();
            if (navPackages) navPackages.onclick = () => currentUser && showPackages();
            if (navProfile) {
                navProfile.onclick = () => {
                    if (!currentUser) return;
                    document.querySelectorAll('#packagesPage, #papersPage, #quizPage, #resultsPage, #progressPage, #loginPage').forEach(el => el.classList.add('hidden'));
                    document.getElementById('profilePage').classList.remove('hidden');
                    document.getElementById('profileUsername').innerText = currentUser.username;
                    document.getElementById('profileGrade').innerText = currentGrade;
                    document.getElementById('profileCreated').innerText = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A';
                    document.getElementById('profileLastLogin').innerText = currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'First login';
                    document.getElementById('profileLoginCount').innerText = currentUser.loginCount || 1;
                    let totalCompleted = 0;
                    let userPackages = getUserPackages(currentUser.username, currentGrade);
                    for (let pkg of userPackages) {
                        for (let paper = 1; paper <= pkg.paperCount; paper++) {
                            if (getAttempts(currentUser.username, currentGrade, pkg.key, paper) >= MAX_ATTEMPTS) totalCompleted++;
                        }
                    }
                    document.getElementById('profileTotalCompleted').innerText = totalCompleted;
                };
            }
            if (navProgress) {
                navProgress.onclick = () => { if (!currentUser) return; document.querySelectorAll('#packagesPage, #papersPage, #quizPage, #resultsPage, #profilePage, #loginPage').forEach(el => el.classList.add('hidden')); document.getElementById('progressPage').classList.remove('hidden'); loadProgressPage(); };
            }
            if (navLogout) {
                navLogout.onclick = () => { if (confirm("Logout?")) { if (currentUser) removeSession(currentUser.username); location.reload(); } };
            }
            
            // ===== BACK BUTTONS =====
            const profileBackBtn = document.getElementById('profileBackBtn');
            if (profileBackBtn) profileBackBtn.onclick = () => showPackages();
            
            const progressBackBtn = document.getElementById('progressBackBtn');
            if (progressBackBtn) progressBackBtn.onclick = () => showPackages();
            
            const refreshProgressBtn = document.getElementById('refreshProgressBtn');
            if (refreshProgressBtn) refreshProgressBtn.onclick = () => { loadProgressPage(); alert("Progress refreshed!"); };
            
            const papersBackBtn = document.getElementById('papersBackBtn');
            if (papersBackBtn) papersBackBtn.onclick = () => showPackages();
            
            const resultsBackBtn = document.getElementById('resultsBackBtn');
            if (resultsBackBtn) resultsBackBtn.onclick = () => { document.getElementById('resultsPage').classList.add('hidden'); showPapers(); };
            
            // ===== QUIZ BUTTONS =====
            const nextBtn = document.getElementById('nextQuestionBtn');
            if (nextBtn) nextBtn.onclick = nextQuestion;
            
            const prevBtn = document.getElementById('prevQuestionBtn');
            if (prevBtn) prevBtn.onclick = prevQuestion;
            
            const quizExitBtn = document.getElementById('quizExitBtn');
            if (quizExitBtn) quizExitBtn.onclick = () => { if (confirm("Exit?")) { if (timer) clearInterval(timer); quizActive = false; document.getElementById('quizPage').classList.add('hidden'); showPapers(); } };
            
            const downloadAnswersBtn = document.getElementById('downloadAnswersBtn');
            if (downloadAnswersBtn) downloadAnswersBtn.onclick = downloadAnswers;
            
            const downloadReportBtn = document.getElementById('downloadReportBtn');
            if (downloadReportBtn) downloadReportBtn.onclick = downloadPDF;
            
            // ===== PAYMENT MODAL =====
            const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
            if (confirmPaymentBtn) confirmPaymentBtn.onclick = handlePaymentSubmit;
            
            const closePaymentModal = document.getElementById('closePaymentModal');
            if (closePaymentModal) closePaymentModal.onclick = () => document.getElementById('paymentModal').classList.add('hidden');
            
            const closeWaitingModal = document.getElementById('closeWaitingModal');
            if (closeWaitingModal) closeWaitingModal.onclick = () => document.getElementById('waitingModal').classList.add('hidden');
            
            const closeResultBtn = document.getElementById('closeResultBtn');
            if (closeResultBtn) closeResultBtn.onclick = () => document.getElementById('resultModal').classList.add('hidden');
            
            const closeSlipModal = document.getElementById('closeSlipModal');
            if (closeSlipModal) closeSlipModal.onclick = () => document.getElementById('slipViewModal').classList.add('hidden');
            
            const closeEditModal = document.getElementById('closeEditModal');
            if (closeEditModal) closeEditModal.onclick = () => document.getElementById('editQuestionModal').classList.add('hidden');
            
            const cancelEditBtn = document.getElementById('cancelEditBtn');
            if (cancelEditBtn) cancelEditBtn.onclick = () => document.getElementById('editQuestionModal').classList.add('hidden');
            
            const saveEditBtn = document.getElementById('saveEditBtn');
            if (saveEditBtn) saveEditBtn.onclick = saveEditedQuestion;
            
            // ===== FORGOT MODALS =====
            let forgotGrade = null;
            const forgotGrade10 = document.getElementById('forgotGrade10Btn');
            const forgotGrade11 = document.getElementById('forgotGrade11Btn');
            if (forgotGrade10) forgotGrade10.onclick = () => { forgotGrade = 10; forgotGrade10.classList.add('selected'); if(forgotGrade11) forgotGrade11.classList.remove('selected'); };
            if (forgotGrade11) forgotGrade11.onclick = () => { forgotGrade = 11; forgotGrade11.classList.add('selected'); if(forgotGrade10) forgotGrade10.classList.remove('selected'); };
            
            const searchUsernameBtn = document.getElementById('searchUsernameBtn');
            if (searchUsernameBtn) searchUsernameBtn.onclick = () => { if (!forgotGrade) { alert("Select grade"); return; } document.getElementById('usernameList').innerHTML = '<div class="bg-white rounded p-2 border">📝 student1</div><div class="bg-white rounded p-2 border mt-1">📝 student2</div>'; document.getElementById('usernameResult').classList.remove('hidden'); };
            
            const closeForgotModal = document.getElementById('closeForgotUsernameModal');
            if (closeForgotModal) closeForgotModal.onclick = () => document.getElementById('forgotUsernameModal').classList.add('hidden');
            
            const forgotUsernameBtn = document.getElementById('forgotUsernameBtn');
            if (forgotUsernameBtn) forgotUsernameBtn.onclick = () => document.getElementById('forgotUsernameModal').classList.remove('hidden');
            
            const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
            if (forgotPasswordBtn) forgotPasswordBtn.onclick = () => document.getElementById('resetRequestModal').classList.remove('hidden');
            
            const closeResetModal = document.getElementById('closeResetModal');
            if (closeResetModal) closeResetModal.onclick = () => document.getElementById('resetRequestModal').classList.add('hidden');
            
            const resetRequestForm = document.getElementById('resetRequestForm');
            if (resetRequestForm) resetRequestForm.onsubmit = (e) => { e.preventDefault(); alert("✅ Request submitted! Admin will review."); document.getElementById('resetRequestModal').classList.add('hidden'); };
            
            // ===== ADMIN TABS =====
            const tabs = ['Dashboard', 'Activity', 'Students', 'CreateAccount', 'PackageManagement', 'Insights', 'Sessions', 'AccountRecords', 'Reset', 'Payments', 'Completed', 'ManagePapers', 'ResetPapers', 'Settings'];
            tabs.forEach(tab => {
                const btn = document.getElementById(`adminTab${tab}`);
                if (btn) {
                    btn.onclick = () => {
                        tabs.forEach(t => {
                            const panel = document.getElementById(`admin${t}Panel`);
                            if (panel) panel.classList.add('hidden');
                            const tabBtn = document.getElementById(`adminTab${t}`);
                            if (tabBtn) {
                                tabBtn.classList.remove('bg-green-100', 'text-green-800');
                                tabBtn.classList.add('bg-gray-100', 'text-gray-600');
                            }
                        });
                        const activePanel = document.getElementById(`admin${tab}Panel`);
                        if (activePanel) activePanel.classList.remove('hidden');
                        btn.classList.remove('bg-gray-100', 'text-gray-600');
                        btn.classList.add('bg-green-100', 'text-green-800');
                        if (tab === 'ManagePapers') {
                            updatePaperDropdowns();
                            loadQuestionsToEditor();
                        }
                        if (tab === 'ResetPapers') {
                            updateAssignDropdowns();
                            updatePaperDropdowns();
                        }
                        if (tab === 'PackageManagement') {
                            refreshPackagesList();
                            updateAssignDropdowns();
                            updateStudentAssignmentsList();
                        }
                    };
                }
            });
            
            // ===== CREATE ACCOUNT =====
            const createAccountBtn = document.getElementById('createAccountBtn');
            if (createAccountBtn) createAccountBtn.onclick = createStudentAccount;
            
            const exportAccountsBtn = document.getElementById('exportAccountsBtn');
            if (exportAccountsBtn) {
                exportAccountsBtn.onclick = function() {
                    let students = getAllStudentsList();
                    let csvRows = [['Username', 'Grade', 'Created Date', 'Last Login', 'Login Count']];
                    for (let [username, data] of Object.entries(students)) {
                        csvRows.push([username, data.grade, new Date(data.createdAt).toLocaleString(), data.lastLogin ? new Date(data.lastLogin).toLocaleString() : 'Never', data.loginCount || 0]);
                    }
                    let csvContent = csvRows.map(row => row.join(',')).join('\n');
                    let blob = new Blob([csvContent], { type: 'text/csv' });
                    let a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `accounts_export_${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    alert('Accounts exported to CSV!');
                };
            }
            
            // ===== PACKAGE MANAGEMENT =====
            const createNewPackageBtn = document.getElementById('createNewPackageBtn');
            if (createNewPackageBtn) createNewPackageBtn.onclick = createNewPackage;
            
            const assignPkgBtn = document.getElementById('assignPkgToStudentBtn');
            if (assignPkgBtn) assignPkgBtn.onclick = assignPackageToStudentHandler;
            
            // ===== RESET PAPERS =====
            const resetPaperBtn = document.getElementById('resetPaperBtn');
            if (resetPaperBtn) resetPaperBtn.onclick = resetPaperAdmin;
            
            const resetPackageBtnAdmin = document.getElementById('resetPackageBtnAdmin');
            if (resetPackageBtnAdmin) resetPackageBtnAdmin.onclick = resetPackageAdmin;
            
            // ===== ADD NEW PAPER =====
            const addNewPaperBtn = document.getElementById('addNewPaperBtn');
            if (addNewPaperBtn) addNewPaperBtn.onclick = handleAddNewPaper;
            
            // ===== BULK UPLOAD =====
            const uploadZone = document.getElementById('uploadZone');
            const bulkFileInput = document.getElementById('bulkFileInput');
            const confirmUploadBtn = document.getElementById('confirmUploadBtn');
            
            if (uploadZone) uploadZone.onclick = () => { if(bulkFileInput) bulkFileInput.click(); };
            if (bulkFileInput) {
                bulkFileInput.onchange = (e) => {
                    let file = e.target.files[0];
                    if (!file) return;
                    const preview = document.getElementById('uploadPreview');
                    if (preview) {
                        preview.innerHTML = `<p class="text-green-600">📄 File: ${file.name}</p>`;
                        preview.classList.remove('hidden');
                    }
                    if (confirmUploadBtn) confirmUploadBtn.classList.remove('hidden');
                    window.pendingFile = file;
                };
            }
            if (confirmUploadBtn) {
                confirmUploadBtn.onclick = () => {
                    if (window.pendingFile) {
                        parseExcelAndUpload(window.pendingFile, document.getElementById('bulkGradeSelect').value, document.getElementById('bulkPackageSelect').value, document.getElementById('bulkPaperSelect').value);
                        const preview = document.getElementById('uploadPreview');
                        if (preview) preview.classList.add('hidden');
                        confirmUploadBtn.classList.add('hidden');
                        window.pendingFile = null;
                        if(bulkFileInput) bulkFileInput.value = '';
                    }
                };
            }
            
            // ===== LOAD QUESTIONS =====
            const loadQuestionsBtn = document.getElementById('loadQuestionsBtn');
            if (loadQuestionsBtn) loadQuestionsBtn.onclick = loadQuestionsToEditor;
            
            const addNewQuestionBtn = document.getElementById('addNewQuestionBtn');
            if (addNewQuestionBtn) addNewQuestionBtn.onclick = addNewQuestion;
            
            // ===== DROPDOWN CHANGE HANDLERS =====
            const bulkPackageSelect = document.getElementById('bulkPackageSelect');
            if (bulkPackageSelect) bulkPackageSelect.onchange = updatePaperDropdowns;
            
            const editPackageSelect = document.getElementById('editPackageSelect');
            if (editPackageSelect) editPackageSelect.onchange = updatePaperDropdowns;
            
            const resetPackageSelect = document.getElementById('resetPackageSelect');
            if (resetPackageSelect) resetPackageSelect.onchange = updatePaperDropdowns;
            
            // ===== SESSION EXPIRED MODAL =====
            const sessionExpiredOkBtn = document.getElementById('sessionExpiredOkBtn');
            if (sessionExpiredOkBtn) sessionExpiredOkBtn.onclick = () => { location.reload(); };
            
            console.log("✅ System fully initialized! User Profile Management feature added!");
        });
    </script>
</body>
</html>

// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://your-backend-url.com/api';

let authToken = localStorage.getItem('authToken');
let socket = null;

// Initialize Socket.io connection
function initSocket(userId) {
    if (socket) socket.disconnect();
    
    socket = io(window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://your-backend-url.com');
    
    socket.on('connect', () => {
        console.log('Socket connected');
        socket.emit('authenticate', userId);
    });
    
    // Listen for payment updates
    socket.on('payment_approved', (data) => {
        showNotification('✅ Payment Approved!', data.message, 'success');
        refreshPackages();
    });
    
    socket.on('payment_rejected', (data) => {
        showNotification('❌ Payment Rejected', data.message, 'error');
        refreshPackages();
    });
    
    socket.on('payment_status_update', (data) => {
        showNotification('Payment Update', data.message, 'info');
        refreshPackages();
    });
}

// API call wrapper
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        }
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        if (response.status === 401) {
            // Token expired
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.reload();
        }
        throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
}

// Login function
async function login(username, password, grade) {
    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password, grade })
        });
        
        if (response.success) {
            authToken = response.token;
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Initialize socket connection
            initSocket(response.user.id);
            
            return { success: true, user: response.user };
        }
        return { success: false, error: response.error };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get packages
async function getUserPackages() {
    try {
        const response = await apiCall('/packages');
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Get paper questions
async function getPaperQuestions(packageId, paperNumber) {
    try {
        const response = await apiCall(`/quiz/${packageId}/${paperNumber}/questions`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Submit quiz answers
async function submitQuiz(packageId, paperNumber, answers, timeTaken) {
    try {
        const response = await apiCall(`/quiz/${packageId}/${paperNumber}/submit`, {
            method: 'POST',
            body: JSON.stringify({ answers, timeTaken })
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Submit payment with file upload
async function submitPayment(packageId, transactionRef, paymentDate, amount, slipFile) {
    const formData = new FormData();
    formData.append('packageId', packageId);
    formData.append('transactionRef', transactionRef);
    formData.append('paymentDate', paymentDate);
    formData.append('amount', amount);
    formData.append('slip', slipFile);
    
    const response = await fetch(`${API_URL}/payments/submit`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
}

// Show notification (Toast)
function showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.innerHTML = `
        <div class="font-bold">${title}</div>
        <div class="text-sm">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Admin functions
async function adminLogin(password) {
    // Admin login is handled by a special route or middleware
    // You can check against a hardcoded password or have an admin user
    if (password === 'Admin2025') {
        localStorage.setItem('isAdmin', 'true');
        return true;
    }
    return false;
}

async function getPendingPayments() {
    const response = await apiCall('/payments/pending');
    return response.data;
}

async function approvePayment(paymentId) {
    const response = await apiCall(`/payments/${paymentId}/approve`, { method: 'PUT' });
    return response.success;
}

async function rejectPayment(paymentId, notes) {
    const response = await apiCall(`/payments/${paymentId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ notes })
    });
    return response.success;
}

// Export functions to window for HTML onclick handlers
window.login = login;
window.getUserPackages = getUserPackages;
window.getPaperQuestions = getPaperQuestions;
window.submitQuiz = submitQuiz;
window.submitPayment = submitPayment;
window.adminLogin = adminLogin;
window.getPendingPayments = getPendingPayments;
window.approvePayment = approvePayment;
window.rejectPayment = rejectPayment;