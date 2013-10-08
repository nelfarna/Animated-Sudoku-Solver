(function(exports) {


	function Node() {
		this.val = null;
		this.next = null;
		this.prev = null;
		this.position = null;
	}

	function LinkedList() {

		this.first = null;

		this.last = null;

		this.length = 0;

	}

	exports.LinkedList = LinkedList;

	LinkedList.prototype.getSize = function() {
			return this.length;
	};

	LinkedList.prototype.add = function (val, pos) {

			var node = new Node();
			node.val = val;
			node.position = pos;

			if (this.first == null) {

				this.first = node;
				this.last = node;

			} else {

				this.prev = this.last;
				this.last.next = node;
				this.last = node;

			}

			this.length++;

	};


}) (typeof exports == 'undefined' ? this : exports);

