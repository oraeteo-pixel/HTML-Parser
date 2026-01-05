알리미
========

Plugin Name: 알리미
Description: 답글, 댓글, 댓글의 댓글에 대한 알림을 기록합니다.
Plugin URI: http://lovelyus.net/plugins/g5/pushmsg
Author: Chongmyung Park
Author URI: http://byfun.com
Version: 1.2.4
Platform: GPF5
Plugin Scope: SITE 
Required GPF Version: 5.0.0
Tested up to: 5.0.4
Plugin License: GPLv2 
Donation URI: http://lovelyus.net/donation
Tags: 알리미, 댓글, 답글

답글, 댓글, 댓글의 댓글, 쪽지 보내기에 대한 알림을 기록합니다.

알림 목록
---------

플러그인을 설치하고 활성화하면 답글,댓글,쪽지 등의 알림이 기록됩니다.
알림 목록은 다음의 URL에서 확인 할 수 있습니다.

  http://그누보드/gp/do.php?id=pushmsg&act=psm_list

외부 페이지에서 읽지않은 알림 가져오기
--------------------------------------

아웃로그인이나 다른 페이지에서 읽지않은 알림 목록을 가져오는 방법입니다.
간단히 psm_unreads() 를 호출하면 됩니다.

[code php]
  <!-- 알리미 -------------->
  <?php
  $unreads = psm_unreads();
  ?>
  <a href="<?php echo GP_URL; ?>/do.php?id=pushmsg&act=psm_list" class="psm_notice" id="psm_notice">
    알림 <span class="psm_total"><?php echo $unreads['total'];?></span>
  </a>
  <div id="psm_unread_list">
    <ul>
    <?php
    foreach($unreads['list'] as $item)
    {
      echo '<li><a href="'.$item['link'].'" data-psm-type="'.$item['push_type']
            .'" data-pid="'.$item['id'].'">'.$item['subject'].'</a></li>';
    }
    ?>
    </ul>
    <?php if($unreads['total'] == 0) { 
      echo '<div id="psm_nolist">새로운 알림이 없습니다.</div>';
    }
    ?>
    <a href="<?php echo GP_URL; ?>/do.php?id=pushmsg&act=psm_list" id="psm_list_all">모두보기</a>
  </div>
  <script type="text/javascript">
  $('#psm_notice').click(function(evt) {
    evt.preventDefault();  
    $('#psm_unread_list').toggle();
  });
  $('#psm_unread_list li a').click(function(evt) {
    evt.preventDefault();
    var $this = $(this);
    var href = $this.attr('href');
    var push_type = $this.attr('data-psm-type');
    $.ajax({
      url: '<?php echo GP_URL;?>/do.php?id=pushmsg&act=psm_read_one&pid='+$(this).attr('data-pid'),
      type : 'post',
      dataType : 'json',
      error : function(jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
      },
      success : function(json) {
        if(json.code == -1) { alert(json.msg); return; }
        if(push_type == 'memo') { win_memo(href); return; }
        location.href=href;
      }
    });
  });
  </script>
  <style>
    .psm_notice{display:inline-block;padding:3px 5px;
      border:1px solid #eee;cursor:pointer;text-decoration:none;}
    .psm_total{display:inline-block;padding:2px 3px;
      background-color:#f0f0f0;color:#EB3C8A;
      border-radius: 10px 10px 10px 10px;}
    #psm_unread_list{position:absolute;display:none;margin:0;
      padding:2px;min-width:150px;border:1px solid #eee;
      background-color:#fff;z-index:999}
    #psm_unread_list ul{margin:0;padding:0}
    #psm_unread_list li{padding:3px;list-style:none;}
    #psm_unread_list li:before{content:"·";font-size:25px;
      vertical-align:middle;line-height:10px;}
    #psm_unread_list li a{font-size:11px;text-decoration:none;}
    #psm_nolist{padding:20px 10px;color:#aaa;text-align:center;}
    #psm_list_all{display:block;margin-top:3px;padding:2px;
      border-top:1px solid #eee;text-align:center;font-size:11px;}
    #psm_list_all:hover{color:#EF77EE;}
  </style>
  <!-- // 알리미 -------------->
[/code]

psm_unreads() 함수가 반환하는 값의 형태는 아래와 같습니다.

[code php]
Array (
  [push_list_link] => // 알림 목록 페이지 주소
  [total] => 1  // 전체 안읽은 알람 수
  [reply] => 0  // 답글 수
  [comment] => 0  // 댓글 수
  [comment_reply] => 0  // 댓글의 댓글 수
  [memo] => 1 // 쪽지 수
  [list] => Array ( // 안읽은 알람 목록
    [0] => Array  // 첫번째 알람
    (
      [id] => 
      [push_type] => // memo 또는 comment 또는 comment_reply 또는 reply
      [sender] => // 보내는 사람 아이디 또는 이름(비로그인)
      [receiver] => // 받는사람 아이디
      [prop] => Array (
        // prop 는 알람 형태에 따라 다릅니다.
      )
      [checked] => 
      [reg_date] => // Y-m-d H:i:s
      [subject] => // 알람 메시지
      [link] => // 쪽지,글,댓글의 주소
    )
    [1] => Array(), // 두번째 알람
    [2] => Array(), // 세번째 알람
    ...
  )
)
[/code]

업데이트
--------
  - 1.2.4 (2013-10-22)
    - 댓글알림 중 receiver 가 없는 알림이 발생하는 경우 수정
  - 1.2.3 (2013-10-12)
    - GPF 5.0.4 대응 (do.php, admin_do.php) : 알리미 사용 예제가 변경되었습니다
  - 1.2.0 (2013-09-23)
    - 사용자명 출력 형태 설정 기능 추가
