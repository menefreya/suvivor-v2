// Clear localStorage to reset draft and sole survivor data
console.log('Clearing all Survivor app data...');

// Clear draft data
localStorage.removeItem('survivor_draft_rankings');
localStorage.removeItem('survivor_draft_picks');
localStorage.removeItem('survivor_draft_submitted');

// Clear sole survivor data
localStorage.removeItem('survivor_sole_survivor_pick');
localStorage.removeItem('survivor_sole_survivor_submitted');

// Clear any other potential cached data
localStorage.removeItem('survivor_user_data');
localStorage.removeItem('survivor_settings');

console.log('✅ All Survivor app data cleared!');
console.log('🔄 Please refresh the page to see changes.');
console.log('📅 Draft deadline is now set to February 15, 2026');
console.log('🎯 The draft should now be open and accessible!');