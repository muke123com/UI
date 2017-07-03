(function($) {
	$.fn.extend({
		lSelect: function(options) {
			var settings = {
				choose: "请选择...",
				emptyValue: "",
				cssStyle: {"margin-right": "4px"},
				url: null,
				type: "GET"
			};
			$.extend(settings, options);
			
			var cache = {};
			return this.each(function() {
				var $input = $(this);
				var id = $input.val();
//				var treePath = $input.attr("treePath");
				var treePath = getAreaTreePath(id);
				var selectName = $input.attr("name") + "_select";
				
				if (treePath != null && treePath != "") {
					var ids = (treePath + id + ",").split(",");
					var $position = $input;
					for (var i = 1; i < ids.length; i ++) {
						$position = addSelect($position, ids[i - 1], ids[i]);
					}
				} else {
					addSelect($input, null, null);
				}
				
				/**
				 * @param {Object} parentId
				 * 获取area.js数据
				 */
				function getArea(parentId){
					var arr = {};
					areasList.forEach(function(item){
						if(item.parent == parentId){
							arr[item.id] = item.name;
						}
					})
					return arr;
				}
				
				/**
				 * @param {Object} id
				 * 获取area.js特定id的tree_path属性
				 */
				function getAreaTreePath(id){
					var tree_path = "";
					areasList.forEach(function(item){
						if(item.id == id){
							tree_path = item.tree_path;
						}
					})
					return tree_path;
				}
				
				function addSelect($position, parentId, currentId) {
					$position.nextAll("select[name=" + selectName + "]").remove();
					if ($position.is("select") && (parentId == null || parentId == "")) {
						return false;
					}
					if (cache[parentId] == null) {
						if(parentId == ""){
							parentId = null;
						}
						cache[parentId] = getArea(parentId);
						
//						$.ajax({
//							url: settings.url,
//							type: settings.type,
//							data: parentId != null ? {parentId: parentId} : null,
//							dataType: "json",
//							cache: false,
//							async: false,
//							success: function(data) {
//								cache[parentId] = data;
//							}
//						});
					}
					var data = cache[parentId];
					if ($.isEmptyObject(data)) {
						return false;
					}
					var select = '<select lay-ignore name="' + selectName + '">';
					if (settings.emptyValue != null && settings.choose != null) {
						select += '<option value="' + settings.emptyValue + '">' + settings.choose + '</option>';
					}
					$.each(data, function(value, name) {
						if(value == currentId) {
							select += '<option value="' + value + '" selected="selected">' + name + '</option>';
						} else {
							select += '<option value="' + value + '">' + name + '</option>';
						}
					});
					select += '</select>';
					return $(select).css(settings.cssStyle).insertAfter($position).bind("change", function() {
						var $this = $(this);
						if ($this.val() == "") {
							var $prev = $this.prev("select[name=" + selectName + "]");
							if ($prev.size() > 0) {
								$input.val($prev.val());
							} else {
								$input.val(settings.emptyValue);
							}
						} else {
							$input.val($this.val());
						}
						addSelect($this, $this.val(), null);
					});
				}
			});
			
		}
	});
})(jQuery);