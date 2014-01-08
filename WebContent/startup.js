chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('questionPage.html', {
    'bounds': {
      'width': 1000,
      'height': 1000
    }
  }, function(win) {
	  win.maximize();
  });
});
