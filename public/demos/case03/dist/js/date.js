/* range */
$(function() {
  $('input[name="dates"]').daterangepicker({
    startDate: moment(),
    showDropdowns: true,
    locale: {
        "format": "MM/DD/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "週日",
            "週一",
            "週二",
            "週三",
            "週四",
            "週五",
            "週六"
        ],
        "monthNames": [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
        ],
        "firstDay": 1
    },
  }, function(start, end, label) {
  });
});


/* single01 */
$(function() {
  $('input[name="dates_single"]').daterangepicker({
    startDate: moment(),
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
        "format": "MM/DD/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "週日",
            "週一",
            "週二",
            "週三",
            "週四",
            "週五",
            "週六"
        ],
        "monthNames": [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
        ],
        "firstDay": 1
    },
  }, function(start, end, label) {
  });
});


/* single02 */
$(function() {
  $('input[name="dates_single2"]').daterangepicker({
    startDate: moment(),
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
        "format": "MM/DD/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "週日",
            "週一",
            "週二",
            "週三",
            "週四",
            "週五",
            "週六"
        ],
        "monthNames": [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
        ],
        "firstDay": 1
    },
  }, function(start, end, label) {
  });
});

/* single03 */
$(function() {
  $('input[name="dates_single3"]').daterangepicker({
    startDate: moment(),
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
        "format": "MM/DD/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "週日",
            "週一",
            "週二",
            "週三",
            "週四",
            "週五",
            "週六"
        ],
        "monthNames": [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
        ],
        "firstDay": 1
    },
  }, function(start, end, label) {
  });
});



/* single02_up */
    $(function() {
      $('input[name="dates_single2_up"]').daterangepicker({
        startDate: moment(),
        singleDatePicker: true,
        showDropdowns: true,
        drops: "up",
        locale: {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "週日",
                "週一",
                "週二",
                "週三",
                "週四",
                "週五",
                "週六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        },
      }, function(start, end, label) {
      });
    });




/* single_MY */
    $(function() {
      $('input[name="dates_single_MY"]').daterangepicker({
        startDate: moment(),
        singleDatePicker: true,
        linkedCalendars: false,
        showDropdowns: true,
        drops: "up",
        locale: {
            "format": "MM/YYYY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "週日",
                "週一",
                "週二",
                "週三",
                "週四",
                "週五",
                "週六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        },
      }, function(start, end, label) {
      });
    });





/* single01 */
$(function() {
      $('input[name="dates_single_up"]').daterangepicker({
        singleDatePicker: true,
        locale: {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "週日",
                "週一",
                "週二",
                "週三",
                "週四",
                "週五",
                "週六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        },
        opens: 'left',
        drops: "up",
      }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
      });
    });
