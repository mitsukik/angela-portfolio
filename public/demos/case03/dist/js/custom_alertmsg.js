
/* differnt OS css */
var OSName="Unknown OS"; 
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows"; 
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS"; 
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX"; 
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux"; 

document.body.classList.add( OSName);



/* 3 btn */
$('.test00').on('click', function () {
  Swal.fire({
    title: 'Do you want to save the changes?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
})


/* Save btn */
$('.alert-save').on('click', function () {
  Swal.fire({
    title: 'Do you want to save the changes?',
    showDenyButton: true,
    confirmButtonText: '儲存',
    confirmButtonColor: '#6ea176',
    denyButtonColor: '#999',
    denyButtonText: `取消`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('已儲存!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info',)
      }
    })
})

/* Save btn2 */
$('.alert-save02').on('click', function () {
  Swal.fire({
    title: 'Do you want to save the changes?',
    showDenyButton: true,
    confirmButtonText: '暫存',
    confirmButtonColor: '#6ea176',
    denyButtonColor: '#999',
    denyButtonText: `取消`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('已暫存!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
})


/* Save btn3 */
$('.alert-save03').on('click', function () {
  Swal.fire({
    title: 'Do you want to save the changes?',
    showDenyButton: true,
    confirmButtonText: '確認入庫',
    confirmButtonColor: '#6ea176',
    denyButtonColor: '#999',
    denyButtonText: `取消`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('已確認入庫!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
})



/* 提醒 */
$('.alert-remind01').on('click', function () {
  Swal.fire(
    '提醒',
    '半成品品名: B-27-BQ，批號1710504，庫存數單不足，無法開立製令',
    'warning'
  )
})


/* 提醒2 */
$('.alert-remind02').on('click', function () {
  Swal.fire({
    title: '提醒',
    text: "半成品檢驗判定結果為不合格，請問是否重工並開立製令?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6ea176',
    cancelButtonColor: '#999',
    confirmButtonText: '開立製令'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        '確定!',
        '已開立製令',
        'success'
      )
    }
  })
})


/* delete btn */
$('.alert-delete').on('click', function () {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F55050',
    cancelButtonColor: '#999',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
})


/* timer */
$('.test03').on('click', function () {
  Swal.fire({
    position: 'bottom-end',
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500
  })
})





