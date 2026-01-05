<?php
include_once('./_common.php');
/****
$cd28Arr = array('亢','角','軫','翼','張','星','柳','鬼','井','參','紫','畢','昴','胃','婁','奎','壁','室','危','虛','女','牛','斗','箕','尾','心','房','氐','中','中','亢','角','軫','翼','張','星','柳','鬼','井','參','觜','畢','昴','胃','婁','奎','壁','室','危','虛','女','牛','斗','箕','尾','心','房','氐','中','中');
$cd8Arr = array('坎','兌','震','中','巽','艮','離','乾','中','坤');
$cd60Arr = array('辛酉','壬戌','癸亥','甲子','乙丑','丙寅','丁卯','戊辰','己巳','庚午','辛未','壬申','癸酉','甲戌','乙亥','丙子','丁丑','戊寅','己卯','庚辰','辛巳','壬午','癸未','甲申','乙酉','丙戌','丁亥','戊子','己丑','庚寅','辛卯','壬辰','癸巳','甲午','乙未','丙申','丁酉','戊戌','己亥','庚子','辛丑','壬寅','癸卯','甲辰','乙巳','丙午','丁未','戊申','己酉','庚戌','辛亥','壬子','癸丑','甲寅','乙卯','丙辰','丁巳','戊午','己未','庚申');

//54166 - 98085
//cd_hwmgj
/***
$hwdSql = sql_query(" select * from calenda_data where cd_no >= 54166 and cd_no <= 98085 and cd_hwd = 1 order by cd_no ");

for($i=0;$row=sql_fetch_array($hwdSql);$i++) {

//$nextM = $row['cd_hwm'] + 1 ;
//if($row['cd_hwm']==12) $nextM = 1 ;

$hwdIn = sql_query(" select * from calenda_data where cd_hwm = '{$row['cd_hwm']}' and cd_sy = '{$row['cd_sy']}' order by cd_no ");

for($j=0;$rowj=sql_fetch_array($hwdIn);$j++) {
		sql_query("
			update calenda_data set
			cd_hwmgj = '{$row['cd_hwmgj']}'
			where cd_no = {$rowj['cd_no']}
			");
}


//	$newId = $row['cd_no'] - 54166 ;
//	$newNo = $i % 60 ;
//	$cd60 = $cd60Arr[$newNo];
/****
	sql_query("
		update calenda_data set
			cd_hwmgj = '{$cd60}'
			where cd_no = {$row['cd_no']}
		");
/****
?>
<li><?php echo $row['cd_no'].' : '.$row['cd_hwm']?>월 <?php echo $row['cd_hwd']?>일</li>

<?php } ?>

<?php ****/?>