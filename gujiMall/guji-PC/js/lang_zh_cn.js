// 所有涉及语言的变量
var lang_zh_cn = {
	loading: "载入中",
	datatables: {
		"emptyTable": "表中没有可用数据",
		"lengthMenu": "每页显示 _MENU_ 条记录",
		"zeroRecords": "没有可显示的记录",
		"info": "显示 _PAGES_ 页中的第 _PAGE_ 页",
		"infoEmpty": "没有可显示记录",
		"infoFiltered": "(总共 _MAX_ 条记录的筛选结果)",
		"loadingRecords": "载入中",
		"processing": "处理中",
        "sProcessing": "正在加载数据...",
		"paginate": {
			"first": "第一页",
			"last": "最后一页",
			"next": "下一页",
			"previous": "上一页"
		},
		"aria": {
			"sortAscending": ": 以升序排列",
			"sortDescending": ": 以降序排列"
		}
	},
	select2: {
		formatNoMatches: function(term){
			return ("没有找到与\""+term+"\"匹配的结果");
		},
		formatSearching: "搜索中...",
		formatAjaxError: "载入列表失败",
		formatInputTooShort: function(term, minLength){
			return ("您至少需要输入"+minLength+"个字符");
		}, 
		formatInputTooLong: function(term, maxLength){
			return ("您最多只能输入"+maxLength+"个字符");
		},
		formatSelectionTooBig: function(maxSize){
			return ("您最多只能选择"+maxSize+"人");
		},
		formatLoadMore: "正在载入更多数据..."
	},
	datapicker: {
		monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
		yearSuffix: "年"
	}
};