<?php
include_once('./_common.php');

if($act=='') {
	alert('잘못된 접근입니다.');
//echo "WHY??";

} else if($act=='do') { //데이터값에 공백 제거
sql_query(" update cd_cal set cd_j=rtrim(replace(cd_j,' ','')) "); //데이터값에 공백 제거
/*
$do = sql_query(" select cd_no,cd_jg from cd_new where cd_no >= 10000 and cd_no <= 10100 order by cd_no ");
for($i=0;$row=sql_fetch_array($do);$i++)
	echo "<li>".$row['cd_no']." ".$row['cd_jg']."</li>";
*/
} else if($act=='do2') { //cd_new 값을 c_d로 이동 //cd_new의 1은 c_d의 54166
//$l1 = sql_query(" select * from calenda_data where cd_no >= 54166 and cd_no <= 54366 ");
$cdn = sql_query(" select * from cd_cal where cd_a >= 1 order by cd_a ");

for($l=0;$row=sql_fetch_array($cdn);$l++) {
	$cd_aN = $row['cd_a'] + 54165;
sql_query("
	update calenda_data set
		cd_jg = '{$row['cd_j']}',
		cd_etc1 = '{$row['cd_k']}',
		cd_etc2 = '{$row['cd_l']}'
		where cd_no = '{$cd_aN}'
");
}
} else if($act=='do3') {
$do = sql_query(" select * from calenda_data where cd_no >=54166 order by cd_no limit 0,35 ");
for($l=0;$row=sql_fetch_array($do);$l++) {
echo '"'.$row['cd_28j'].'",';
}

} else if($act=='do4') {
$do = sql_query(" select * from cd_gugung where cd_no >=2 order by cd_no ");
for($l=0;$row=sql_fetch_array($do);$l++) {
	$newNo = $row['cd_no'] + 63314;
sql_query("
	update cd_gugung set
		cd_no = '{$newNo}'
		where cd_no = '{$row['cd_no']}'
");
echo '<li>'.$row['cd_no'].' / '.$newNo'</li>';
}

} else if($act=='do5') {
//$do = sql_query(" select * from g5_write_calendar where wr_is_comment = 0 order by wr_id ");
echo "WHY?";
//for($l=0;$row=sql_fetch_array($do);$l++) {
/*
sql_query("
	update g5_write_calendar set
		wr_1 = '{$row['wr_id']}'
		where wr_id = '{$row['wr_id']}'
");
*/
//echo '<li>'.$row['wr_id'].' / '.$row['wr_1']'</li>';
//}

}
?>