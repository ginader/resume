YUI().use('node','event', 'anim', function (Y) {
	function stackScroll(){
		Y.log('stackScroll()');
		//var isScrolled = false;
		var content = Y.one('.scroll');
		var bottom = Y.one('#bottom-stack').setHTML('');
		bottom.setHTML('');
		//var top = Y.one('#top-stack');
		var cards = content.all('.card');
		var cardCount = cards.size();
		var breakpoints = {};
		var maxY = content.get('offsetHeight');
		var stackedCardGap = 3; // analog to $stacked-card-gap:25px; in card-scroll.scss

		Y.log('cardCount:'+cardCount);

		cards.each(function(node, idx){
			var clone = node.cloneNode(true).appendTo(bottom); // duplicate the cards into the top and bottom stack
			Y.log(clone.get("nodeName"));
			var position = node.getXY()[1];
			breakpoints[position] = {
				'idx' : idx,
				'node' : node,
				//'topClone' : top.all('.card').item(idx),
				'bottomClone' : bottom.all('.card').item(idx),
				'position' : position,
				'height' : node.get('offsetHeight')
			};
			var key = node.getAttribute('id');
			if(!key){
				Y.log(node.get('parentNode').get("nodeName"));
				key = node.get('parentNode').getAttribute('id');
			}
			Y.log(key);
			clone.setData('key', key);
			clone.setData('pos',position-40);
		});

		bottom.all('[id]').removeAttribute('id');
		bottom.delegate('click', function(e){
			Y.log('click');
			Y.log(e.currentTarget.getData('key'));
			Y.log(e.currentTarget.getData('pos'));
			var node = Y.one('#'+e.currentTarget.getData('key'));
			var position = e.currentTarget.getData('pos');
			//Y.one('#'+e.currentTarget.getData('key')).scrollIntoView(true);
			var anim = new Y.Anim({
				node: node,
				to: {
					scroll: function() {
						return [0, position];
					}
				},
				easing: Y.Easing.easeOut
			});
			anim.run();
		}, '.card');

		//Y.log(breakpoints);

		var checkscrolled = function () {
			var scrolled = content.get('scrollTop');
			var enter = scrolled + maxY;
			//var exit = scrolled;
			Y.Object.each(breakpoints, function(o,y){
				if(enter - ((cardCount - o.idx)*stackedCardGap) > y){
					//Y.log('content: '+y);
					o.node.removeClass('bottom')
						//.removeClass('top')
						.addClass('content');
					//o.topClone.removeClass('in');
					o.bottomClone.removeClass('in');
				}
				else{
					//Y.log('bottom: '+y);
					o.node.removeClass('content')
						//.removeClass('top')
						.addClass('bottom');
					o.bottomClone.addClass('in');
				}
			});
		};
		checkscrolled(); // once initially in case the page is already scrolled down

		content.on('scroll', checkscrolled);
	}
	stackScroll();
	Y.on("windowresize", stackScroll);
});

