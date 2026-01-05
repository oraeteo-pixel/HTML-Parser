<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

sql_query("UPDATE gpf_logintry SET reported = 1 WHERE mb_id = '{$member['mb_id']}' AND ( stat = 'tried' OR stat = 'locked' OR stat = 'tried and locked' ) AND reported = 0 ");

set_session('sess_logintry', false);

$sql_common = " FROM gpf_logintry AS lt LEFT JOIN {$g5['member_table']} AS mt ON lt.mb_id= mt.mb_id  ";

$sql_search = " WHERE 1=1";

if ($stx) {
    $sql_search .= " AND ( ";
    switch ($sfl) {
        default :
            $sql_search .= " ($sfl LIKE '%$stx%') ";
            break;
    }
    $sql_search .= " ) ";
}

if (!$sst) {
    $sst = "reg_date";
    $sod = "desc";
}

$sql_order = " order by $sst $sod ";

$sql = " SELECT count(*) AS cnt $sql_common $sql_search $sql_order";
$row = sql_fetch($sql);
$total_count = $row['cnt'];
$rows = $config['cf_page_rows'];
$total_page = ceil($total_count / $rows);
if (!$page) $page = 1;
$from_record = ($page - 1) * $rows;

$listall = "<a href=\"".GP_URL."/do.php?id=logintry&act=logintry_list\" class=\"tt\">처음</a>";

$sql = " SELECT * $sql_common $sql_search $sql_order LIMIT $from_record, $rows ";
$result = sql_query($sql);

$list = array();
while($row = sql_fetch_array($result))
{
  array_push($list, $row);
}

function _logintry_msgs($stat)
{
  $msgs = array('loged in'=>'로그인 성공', 'tried'=>'로그인 시도', 'tried and loged in'=>'로그인 시도 후 로그인 성공', 'locked'=>'로그인 잠김', 'tried and locked'=>'로그인 시도 후 잠김', 'unlocked'=>'로그인 잠김 후 로그인 성공');
  if(isset($msgs[$stat])) return $msgs[$stat];
  else return $stat;
}

include_once G5_PATH.DS.'head.php';
?>

<h2>로그인 로그<h2>

<table class="logintry_tbl" cellspacing="1" cellpadding="0">
<colgroup>
  <col width="200px"/>
  <col width="120px"/>
  <col/>
</colgroup>
<thead>
  <tr>
    <th>시간</th>
    <th>IP</th>
    <th>상태</th>
  </tr>
</thead>
<tbody>
  <?php foreach($list as $item) { ?>
  <tr>
    <td><?php echo $item['update_date']; ?></td>
    <td><?php echo $item['ip']; ?></td>
    <td><?php echo _logintry_msgs($item['stat']); ?></td>
  </tr>
  <?php } ?>
  <?php if(empty($list)) { ?>
  <tr>
    <td colspan="3" align="center" height="100px">기록이 없습니다.</td>
  </tr>
  <?php } ?>
</tbody>
</table>
<?php
$pagelist = get_paging($config['cf_write_pages'], $page, $total_page, "?id={$id}&act={$act}&page=");
if ($pagelist) {
?>
  <div><?php echo $pagelist; ?></div>
<?php
}
?>

<style>
 .logintry_tbl{margin-top:10px;width:100%;background-color:#888} 
 .logintry_tbl th,
 .logintry_tbl td{padding:5px;background-color:#fff;text-align:left} 
 .logintry_tbl th{background-color:#444;color:#fff;} 
 .logintry_tbl td{font-weight:normal;} 
</style>
<?php
include_once G5_PATH.DS.'tail.php';
?>
