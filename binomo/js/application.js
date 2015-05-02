$(function() {
	var SCROLL_TOP_BORDER = 40;
	var pageScrolling = false;
	var lPage = document.querySelector('.l-page');

	$(window).scroll(function() {
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		if (scrollTop > SCROLL_TOP_BORDER && !pageScrolling) {
			pageScrolling = true;
			lPage.classList.add('l-page_scroll');
		} else if (scrollTop <= SCROLL_TOP_BORDER && pageScrolling) {
			pageScrolling = false;
			lPage.classList.remove('l-page_scroll');
		}
	});

	// Graphs

	function generateTick(i) {
    time = new Date().getTime();
    if (i) {
      time -= (400*i);
    }
    value = (0.5 - Math.random())/10000 + 1.11950;

    return { "rate": "" + value, "created_at": "" + time/1000 };
  };

	var socket = new WebSocket("wss://s1-platform.binomo.com:8443");
	var timer = new Date().getTime();

	var time, value;
	var data = {'EUR': []};

	for (i = 1800; i>0; i--) {
		data['EUR'].push(generateTick(i));
	}

	$('.b-deal').not('.b-deal_placeholder').each(function() {
		var $self          = $(this),
				$viewModesMenu = $self.find('.b-graph__modes .b-icon-spr'),
				$graph         = $self.find('.b-graph__canvas'),
				chart;

		chart = new Charts({el: $graph[0], name: 'EUR'});
		chart.onReady(function() {
			chart
			.setCollection(data['EUR'])
			.setTimer(data['EUR'][data['EUR'].length-1].created_at*1000 + (2 * 60 * 1000))
			.setPrediction(65, false);

			setInterval(function() {
				var tick = generateTick();
				chart.addPoint([+tick.created_at*1000, +tick.rate]);
			}, 1000);
		});

		$viewModesMenu.click(function() {
			$viewModesMenu.removeClass('active');
			$(this).addClass('active');

			$self.toggleClass('b-deal_wide', $(this).attr('wide') == 'true');
			chart.reflow();
			chart.viewMode($(this).attr('mode'));
		});
	});
});
