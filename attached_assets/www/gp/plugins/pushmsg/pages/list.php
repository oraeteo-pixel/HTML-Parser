<?php
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

$awh = '';
$title = '전체 알림';

if($read == 'y')
{
  $awh = ' AND checked = 1';
  $title = '읽은 알림';
}

if($read == 'n')
{
  $title = '안읽은 알림';
  $awh = ' AND checked IS NULL ';
}

$sql_common = " FROM gpf_pushmsg WHERE receiver = '{$member['mb_id']}' $awh ";
$sql_order = " ORDER BY reg_date DESC ";
$sql = " SELECT count(*) as cnt $sql_common $sql_order";
$row = sql_fetch($sql);
$total_count = $row['cnt'];
$rows = $config['cf_page_rows'];
$total_page  = ceil($total_count / $rows);
if (!$page || $page > $total_page) $page = 1;
$from_record = ($page - 1) * $rows;
$pagelist = get_paging($config['cf_write_pages'], $page, $total_page, "?id={$id}&act={$act}&page=");
$sql = " SELECT * $sql_common $sql_order limit $from_record, $rows ";
$res = sql_query($sql);
$list = array();
while($row = sql_fetch_array($res))
{
  array_push($list, $row);
}
include_once G5_PATH.DS.'head.php';
?>
<style>
#psm{padding:10px;}
#psm_title{padding:10px 0;font-size:13pt;}
#psm_info{margin-bottom:10px;}
#psm_tool_top{width:100%;overflow:auto;}
.psm_tool_left{float:left;}
.psm_tool_right{float:right;}
#psm_list{margin-top:10px;padding:0;border-top:1px solid #f0f0f0;list-style:none;}
#psm_list li{position:relative;padding:8px;border-bottom:1px solid #f0f0f0;}
#psm_list li span{display:inline-block;}
#psm_list li .psm_chk{position:absolute;}
#psm_list li .psm_time{margin-left:30px;width:70px;}
#psm_list li .psm_stat{margin-left:10px;width:50px;color:#83a9ca}
#psm_list li .psm_unread{color:#E35FCF;}
#psm_list li .psm_subj{margin-left:10px;}
#psm_list li .psm_del{position:absolute;right:0;}
#psm_list li a{text-decoration:none;}
#psm_list li a:hover{color:#f94593}
#psm_empty{padding:50px 0;text-align:center;}
#psm_paging{text-align:center;}
.psm_lb{display:none;}
a.psm_btn{display:inline-block;padding:5px 10px;background-color:#8E9EC2;color:#fff;}
a.psm_btn2{display:inline-block;padding:5px 10px;background-color:#C46BC7;color:#fff;}
</style>
<div id="psm">

  <div id="psm_title"><?php echo $title; ?></div>
  <div id="psm_info">
    총 <?php echo $total_count; ?>건이 있습니다.
  </div>

  <form name="psmfrm" action="<?php echo GP_URL; ?>/do.php" method="post">
  <input type="hidden" name="act" value=""/>
  <div id="psm_tool_top">
    <div class="psm_tool_left">
      <a href="javascript:;" class="psm_select_all psm_btn">전체선택</a>
      <a href="javascript:;" class="psm_delete_all psm_btn">선택삭제</a>
      <a href="javascript:;" class="psm_read_all psm_btn">읽은상태 표시</a>
    </div>
    <div class="psm_tool_right">
      <a href="<?php echo $px_url; ?>&act=psm_list" class="psm_btn2">전체보기</a>
      <a href="<?php echo $px_url; ?>&act=psm_list&read=y" class="psm_btn2">읽은 알림</a>
      <a href="<?php echo $px_url; ?>&act=psm_list&read=n" class="psm_btn2">안 읽은 알림</a>
    </div>
  </div>
  <ul id="psm_list">
    <?php
    foreach($list as $item) 
    {
      $prop = unserialize($item['prop']);
      $time = psm_time_ago($item['reg_date'], 1);
      $stat = ($item['checked'] ? '읽음' : '읽지않음');
      $stat_cls = ($item['checked'] ? 'psm_read' : 'psm_unread');
      switch($item['push_type'])
      {
      case 'reply' : 
        $subj = '<b>'.$item['sender'].'</b>님이 내 글에 답글을 남기셨습니다.'; 
        $link = G5_BBS_URL.'/board.php?bo_table='.$prop['bo_table'].'&wr_id='.$prop['wr_id_from']; 
        break;
      case 'comment' : 
        $subj = '<b>'.$item['sender'].'</b>님이 내 글에 댓글을 남기셨습니다.'; 
        $link = G5_BBS_URL.'/board.php?bo_table='.$prop['bo_table'].'&wr_id='.$prop['wr_id_to'].'#c_'.$prop['cmt_id_from']; 
        break;
      case 'comment_reply' : 
        $subj = '<b>'.$item['sender'].'</b>님이 내 댓글에 댓글을 남기셨습니다.'; 
        $link = G5_BBS_URL.'/board.php?bo_table='.$prop['bo_table'].'&wr_id='.$prop['wr_id_to'].'#c_'.$prop['cmt_id_from']; 
        break;
      case 'memo' :
        $subj = '<b>'.$item['sender'].'</b>님으로부터 쪽지가 도착했습니다.';
        $link = G5_BBS_URL.'/memo_view.php?me_id='.$prop['me_id'].'&kind=recv';
        break;
      default:
        $subj = gp_do_filter('pushmsg_subj', $item);
        $link = gp_do_filter('pushmsg_link', $prop);
        break;
      }

    ?>
    <li>
      <span class="psm_chk">
        <label class="psm_lb" for="chk_psm_id_<?php echo $item['id'];?>"><?php echo $item['id']; ?> 아이템 선택</label>
        <input type="checkbox" value="<?php echo $item['id']; ?>" name="chk_psm_id[]" id="chk_psm_id_<?php echo $item['id'];?>" />
      </span>
      <a href="<?php echo $link; ?>" class="psm_link" data-psm-type="<?php echo $item['push_type'];?>" data-pid="<?php echo $item['id'];?>">
        <span class="psm_time"><?php echo $time; ?></span>
        <span class="psm_stat <?php echo $stat_cls;?>"><?php echo $stat; ?></span>
        <span class="psm_subj"><?php echo $subj; ?></span>
      </a>
      <a class="psm_del" href="javascript:psm.delete_one('<?php echo $item['id']; ?>');">x</a>
    </li> 
    <?php
    }
    if(empty($list)) {
      echo '<div id="psm_empty">알림이 없습니다.</div>';
    }
    ?>
  </ul>
  <div id="psm_paging"><?php echo $pagelist; ?></div>
  <div id="psm_tool_bottom"></div>

  <input type="hidden" name="id" value="<?php echo $plugin_id; ?>"/>
  <input type="hidden" name="act" id="psm_act" value=""/>
  <input type="hidden" name="pid" id="psm_pid" value=""/>
  <input type="hidden" name="page" value="<?php echo $page; ?>"/>
  <input type="hidden" name="read" value="<?php echo $read; ?>"/>
  </form>

</div>

<script type="text/javascript">
var psm = {};
psm.form = $('form[name=psmfrm]');
psm.act = $('#psm_act');
psm.pid = $('#psm_pid');
psm.checked = false;
psm.ajax_error = function(jqXHR, textStatus, errorThrown) {
  alert(errorThrown);
};
psm.select_all = function(evt) {
  psm.checked = !psm.checked;
  $('[name="chk_psm_id[]"]').attr('checked', psm.checked);
};
psm.delete_all = function(evt) {
  if($('[name="chk_psm_id[]"]:checked').length == 0) {
    alert('삭제할 알림을 하나 이상 선택하세요');
    return;
  }
  if(!confirm('선택한 항목들을 삭제하시겠습니까?')) return;
  psm.act.val('psm_delete_all');
  psm.form.submit();
};
psm.read_all = function(evt) {
  if($('[name="chk_psm_id[]"]:checked').length == 0) {
    alert('읽음 표시할 알림을 하나 이상 선택하세요');
    return;
  }
  psm.act.val('psm_read_all');
  psm.form.submit();
};
psm.delete_one = function(pid) {
  if(!confirm('삭제하시겠습니까?')) return;
  psm.act.val('psm_delete_one');
  psm.pid.val(pid);
  psm.form.submit();
};
psm.link_click = function(evt) {
  evt.preventDefault();
  var $this = $(this);
  var href = $this.attr('href');
  var push_type = $this.attr('data-psm-type');
  $.ajax({
    url: '<?php echo $px_url;?>&act=psm_read_one&pid='+$(this).attr('data-pid'),
    type : 'post',
    dataType : 'json',
    error : psm.ajax_error,
    success : function(json) {
      if(json.code == -1) { alert(json.msg); return; }
      $this.find('.psm_stat').text('읽음').removeClass('psm_unread').addClass('psm_read');
      if(push_type == 'memo') { win_memo(href); return; }
      location.href=href;
    }
  });
};

$('.psm_select_all').click(psm.select_all);
$('.psm_delete_all').click(psm.delete_all);
$('.psm_read_all').click(psm.read_all);
$('.psm_link').click(psm.link_click);
</script>

<?php
include_once G5_PATH.DS.'tail.php';
?>
