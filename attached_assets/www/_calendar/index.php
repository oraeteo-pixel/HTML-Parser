<?php
define('_CALENDAR_', true);
include_once('./_common.php');
include_once(G5_PATH.'/_head.php');

if($act=='moveWr') {
//	echo G5_URL.$pageUrl;
	$dInfo = explode(':',$dataInfo);
	$wrId = $dInfo[0];
	$wr1 = $dInfo[1];
	$newId = $dInfo[2];
	$new1 = $dInfo[3];
	$wrTable = $g5['write_prefix']."calendar";
	sql_query(" update {$wrTable} set wr_1 = '{$new1}' where wr_id = '{$wrId}' ");
	sql_query(" update {$wrTable} set wr_1 = '{$wr1}' where wr_id = '{$newId}' ");
	goto_url(G5_URL.$pageUrl);
	break;
}
$dateH = date("H");
if(date("H")==0) $dateH = "";
$datei = date("i");
$thisTime = $dateH.$datei;
$thisTime = $thisTime*1;

$tY = date('Y');
$tM = date('n');
$tD = date('j');
$tInfo = sql_fetch(" select * from calenda_data where cd_sy = '{$tY}' and cd_sm = '{$tM}' and cd_sd = '{$tD}' ");
$nextDayNo = $tInfo['cd_no'] + 1;
$nextDay = sql_fetch(" select * from calenda_data where cd_no = '{$nextDayNo}' ");

///cal==hw일때
if($thisTime>=0&&$thisTime<2300) {
	$thisHwy = $tInfo['cd_hwy'];
	$thisHwm = $tInfo['cd_hwm'];
	$thisHwd = $tInfo['cd_hwd'];
} else if($thisTime>=2300&&$thisTime<=2359) {
	$thisHwy = $nextDay['cd_hwy'];
	$thisHwm = $nextDay['cd_hwm'];
	$thisHwd = $nextDay['cd_hwd'];
}
///cal==hw일때

$Ddata = explode('-',$Dcode);
$year = $Ddata[0];
$month = $Ddata[1];
$day = $Ddata[2];
$thisToday = "default";
	
if(($cal=='df'&&$year==date('Y')&&$month==date('n')&&$day==date('j'))||($cal=='hw'&&$year==$thisHwy&&$month==$thisHwm&&$day==$thisHwd))
	$thisToday = "success";

//if(($cal=='df'&&$year==date('Y')&&$month==date('n')&&$day==date('j'))||($cal=='hw'&&$year==$tInfo['cd_hwy']&&$month==$tInfo['cd_hwm']&&$day==$tInfo['cd_hwd']))
//	$thisToday = "success";

if($cal=='df') {
$selectedDay = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' and cd_sd = '{$day}' ");
$month_dayF = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' order by cd_no asc limit 0, 1 ");
$month_dayL = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' order by cd_no desc limit 0, 1 ");
} else if($cal=='hw') {
$selectedDay = sql_fetch(" select * from calenda_data where cd_hwy = '{$year}' and cd_hwm = '{$month}' and cd_hwd = '{$day}' ");
$month_dayF = sql_fetch(" select * from calenda_data where cd_hwy = '{$year}' and cd_hwm = '{$month}' order by cd_no asc limit 0, 1 ");
$month_dayL = sql_fetch(" select * from calenda_data where cd_hwy = '{$year}' and cd_hwm = '{$month}' order by cd_no desc limit 0, 1 ");
}

	if(!$cal) $cal = "hw";
	$is_Dcode = "";
	if(!$Dcode&&!$calendar_id) {
		if($cal=='hw') $is_Dcode = "&amp;Dcode=".$thisHwy.'-'.$thisHwm.'-'.$thisHwd;
		else if($cal=='df') $is_Dcode = "&amp;Dcode=".date('Y').'-'.date('n').'-'.date('j');
	} else if($Dcode) $is_Dcode = "&amp;Dcode=".$Dcode;
	$is_calendar_id = "";
	if($calendar_id) $is_calendar_id = "&amp;calendar_id=".$calendar_id;
	$is_mode = "";
	if($mode) $is_mode = "&amp;mode=".$mode;
	$is_calCate = "";
	if($calCate) $is_calCate = "&amp;calCate=".$calCate;
	if(!$Dcode&&!$calendar_id)
		goto_url(G5_URL.'/_calendar/?cal='.$cal.$is_Dcode.$is_calendar_id.$is_calCate.$is_mode);


$pre_year_real = $year - 1;
$nex_year_real = $year + 1;

$pre_month = $month - 1;
$pre_year = $year; //당월이 1월이 아니면 이전년도는 적용하지 않음
if($month==1) {
	$pre_month = 12; //당월이 1월이면 이전년도는 12월이 되며
	$pre_year = $year - 1; //연도는 이전년도를 적용
}
$nex_month = $month + 1;
$nex_year = $year; //당월이 12월이 아니면 이후년도는 적용하지 않음
if($month==12) {
	$nex_month = 1; //당월이 12월이면 이후년도는 1월이 되며
	$nex_year = $year + 1; //연도는 이후년도를 적용
}

if($cal=='df') {
$pre_month_day_sunL = sql_fetch(" select * from calenda_data where cd_sy = '{$pre_year}' and cd_sm = '{$pre_month}' and cd_week = '일' order by cd_no desc limit 0, 1 ");
$nex_month_day_satF = sql_fetch(" select * from calenda_data where cd_sy = '{$nex_year}' and cd_sm = '{$nex_month}' and cd_week = '토' order by cd_no asc limit 0, 1 ");
} else if($cal=='hw') {
$pre_month_day_sunL = sql_fetch(" select * from calenda_data where cd_hwy = '{$pre_year}' and cd_hwm = '{$pre_month}' and cd_week = '일' order by cd_no desc limit 0, 1 ");
$nex_month_day_satF = sql_fetch(" select * from calenda_data where cd_hwy = '{$nex_year}' and cd_hwm = '{$nex_month}' and cd_week = '토' order by cd_no asc limit 0, 1 ");
}

$first_cd_no = $month_dayF['cd_no'];
if($month_dayF['cd_week']!='일')
	$first_cd_no = $pre_month_day_sunL['cd_no'];
$last_cd_no = $month_dayL['cd_no'];
if($month_dayL['cd_week']!='토')
	$last_cd_no = $nex_month_day_satF['cd_no'];

$mon_date = " select * from calenda_data where cd_no >= '{$first_cd_no}' and cd_no <= '{$last_cd_no}' order by cd_no ";
$result_date = sql_query($mon_date);

$sql_this = " select * from calenda_data where cd_no <= '{$selectedDay['cd_no']}' and cd_hterms != '' order by cd_no desc limit 0, 1 ";
$row_this = sql_fetch($sql_this);

$sql_next = " select * from calenda_data where cd_no > '{$selectedDay['cd_no']}' and cd_hterms != '' order by cd_no limit 0, 1 ";
$row_next = sql_fetch($sql_next);

$last_no = $row_next['cd_no'] - 1;

$sql_last = " select * from calenda_data where cd_no = '{$last_no}' ";
$row_last = sql_fetch($sql_last);

if($row_today['cd_hterms']!='') {
	$hterms = $row_today['cd_hterms'];
	$kterms = $row_today['cd_kterms'];
} else {
	$hterms = $row_this['cd_hterms'];
	$kterms = $row_this['cd_kterms'];
}

//$jg_title = array('동지','소한','대한','입춘','우수','경칩','춘분','청명','곡우','입하','소만','망종','하지','소서','대서','입추','처서','백로','추분','한로','상강','입동','소설','대설');
$jg_title = array('冬至','小寒','大寒','立春','雨水','驚蟄','春分','淸明','穀雨','立夏','小滿','芒種','夏至','小暑','大暑','立秋','處暑','白露','秋分','寒露','霜降','立冬','小雪','大雪');
//$sj_title = array('장손무기','효공','두여회','위징','방현령','고사렴','울지경덕','이정','소우','단지현','유홍기','굴돌통','은개산','시소','장손순덕','장량','후군집','장공근','정지절','우세남','유정회','당검','이세적','진숙보');
$sj_title = array('長孫無忌','孝公','杜如灰','魏徵','房玄齡','顧士廉','蔚遲敬德','李靖','蕭瑀','丹遲玄','劉弘期','屈突通','殷開山','柴紹','張孫順德','張亮','厚君集','張公謹','靖遲節','虞世南','劉靖灰','唐儉','李世勣','秦菽寶');
for($j=0;$j<24;$j++) if($hterms==$jg_title[$j]) $sj_name = $sj_title[$j];
?>

<div id="sqCon">
	<div id="subBtn">
		<button class="btn btn-default showSub" id="comm"><i class="fa fa-comments"></i></button>
	</div>
	<div class="padd10">
		<a class="btn <?php if($cal=='hw') { ?>btn-primary<?php } else { ?>btn-default<?php } ?>" href="<?php echo G5_URL?>/_calendar/?cal=hw">황극력</a>
		<a class="btn <?php if($cal=='hw') { ?>btn-default<?php } else { ?>btn-primary<?php } ?>" href="<?php echo G5_URL?>/_calendar/?cal=df">선천력</a>
	</div>
<?php
$weekHg = array('일', '월', '화', '수', '목', '금', '토');
$weekHj = array('日', '月', '火', '水', '木', '金', '土');
for($w=0;$w<7;$w++) {
	if($selectedDay['cd_week']==$weekHg[$w]) $wHj = $weekHj[$w];
	}
?>

<?php if($Dcode!="") { ?>
<?php if($cal=='df') { ?>
	<div id="calDate" class="round5">
		<?php echo $year?>.<?php echo $month?>.<?php echo $day?> <?php echo $wHj?>
		(음<?php echo $selectedDay['cd_lm']?>.<?php echo $selectedDay['cd_ld']?> <?php echo $selectedDay['cd_hdganjee']?>日)
		<?php echo $hterms?>, <?php echo $sj_name?>
	</div>
	<div class="cl-bo"></div>
	<table cellspacing="0" cellpadding="0" id='calTable0' align='center'>
		<tr align="center">
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=df&Dcode=<?php echo $pre_year_real?>-<?php echo $month?>-1"><i class="fa fa-chevron-left"></i></a></td>
			<td><select class="form-control" name="calY" onChange="window.open(value,'_self');">
		<script>
		for(y=1841; y<=2110; y++){
			s = "";
			if(y=='<?php echo $year?>')	s = " selected";
			document.write("<option value='<?php echo G5_URL.'/_calendar/?cal=df&amp;Dcode='?>"+y+"-<?php echo $month?>-1'"+s+">" + y + "년</option>");
		}
		</script></select></td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=df&Dcode=<?php echo $nex_year_real?>-<?php echo $month?>-1"><i class="fa fa-chevron-right"></i></a></td>
			<td class="padd5"><a class="btn btn-<?php echo $thisToday?> btn-xs" href='<?php G5_URL?>/_calendar/?cal=df&Dcode=<?php echo date('Y')?>-<?php echo date('n')?>-<?php echo date('j')?>' id='today'>오늘</a></td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=df&Dcode=<?php echo $pre_year?>-<?php echo $pre_month?>-1"><i class="fa fa-chevron-left"></i></a></td>
			<td><select class="form-control" name="calM" onChange="window.open(value,'_self');">
		<script>
		for(n=1; n<=12; n++){
			s = "";
			if(n=='<?php echo $month?>') s = " selected";
			document.write("<option value='<?php echo G5_URL.'/_calendar/?cal=df&amp;Dcode='.$year.'-'?>"+n+"-1'"+s+">" + n + "월</option>");
		}
		</script></select></td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=df&Dcode=<?php echo $nex_year?>-<?php echo $nex_month?>-1"><i class="fa fa-chevron-right"></i></a></td>
		</tr>
	</table>

	<div id="calendarBox">
		<table id="calTable"  class="table table-bordered">
			<thead>
				<tr class="warning">
					<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
				</tr>
			</thead>
			<tbody>
<?php
for($d=0; $row_date=sql_fetch_array($result_date); $d++) {
	if($d%7==0||$d==0) echo "<tr>";
	$tdClass[$d] = "";
	$noneDay[$d] = " fwB";
	if($row_date['cd_sm']!=$month) {
		$tdClass[$d] = "active";
		$noneDay[$d] = " noneDay";
	}
	$this_today[$d] = "";
	if($row_date['cd_sy']==date('Y')&&$row_date['cd_sm']==date('n')&&$row_date['cd_sd']==date('j')) $this_today[$d] = " success";
	
	$Cganji[$d] = "";
	if($row_date['cd_hdganjee']==$selectedDay['cd_hdganjee'])
		$Cganji[$d] = "Sel";
	
	$ld[$d] = $row_date['cd_ld'];
	$lDaySel[$d] = "";
	if($row_date['cd_ld']==1) {
		$ld[$d] = "<b>".$row_date['cd_lm'].".".$row_date['cd_ld']."</b>";
		$lDaySel[$d] = "Sel";
	}
	
	$hd[$d] = $row_date['cd_hwd'];
	$hDaySel[$d] = "";
	if($row_date['cd_hwd']==1) {
		$hd[$d] = "<b>".$row_date['cd_hwm'].".".$row_date['cd_hwd']."</b>";
		$hDaySel[$d] = "Sel";
	}
?>
					<td class="calTd <?php echo $tdClass[$d].$this_today[$d]?>" rel="<?php echo $row_date['cd_sy'].'-'.$row_date['cd_sm'].'-'.$row_date['cd_sd'].'-'.$cal?>">
						<span class='sDay<?php echo $noneDay[$d]?>'><?php echo $row_date['cd_sd']?></span>
						<div class='lDay<?php echo $lDaySel[$d]?> round5'><?php echo $ld[$d]?></div>
						<div class='hDay<?php echo $hDaySel[$d]?> round5'><?php echo $hd[$d]?></div>
						<div class='ganji<?php echo $Cganji[$d]?> round5'><?php echo $row_date['cd_hdganjee']?></div>
						<div class='jeolgi'><?php echo $row_date['cd_kterms']?></div>
					</td>

<?php } ?>
			</tbody>
		</table>
	</div>
<?php } else if($cal=='hw') { ?>
<?
$hwgj = sql_fetch(" select cd_hyganjee from calenda_data where cd_ly = '{$selectedDay['cd_hwy']}' ");
$hwgjNext = sql_fetch(" select cd_hyganjee from calenda_data where cd_ly = '{$nextDay['cd_hwy']}' ");
$h28j = array("馬成","鄧禹","劉隆","馬武","藏宮","耿純","劉植","銚期","邳肜","蓋延","万修","景丹","李忠","祭遵","任光","朱佑","王覇","馮異","堅鐔","岑膨","傅俊","寇恂","杜茂","耿弇","陣俊","賈復","王梁","吳漢");
$e28j = array("masung","deungwoo","yuyung","mamu","jangkung","kungsun","yusik","yoki","biyung","kaeyoen","mansu","kyungdan","leechung","jejun","limkwang","juwoo","wangpae","punge","kyunsim","jampeng","pujun","kusun","dumu","kungdan","jinjun","kabok","wanglyang","ohan");
$h28j4 = array("日月之位","天地之間","瑞化之造","珀雨之順","寵露之功","玲霜之心","玉雪之契","熱薰之序","寒冷之節","陰氣之理","陽氣之理","走獸之迷","飛禽之殊","人生之貴","沙石之極","岩岸之顯","澤地之幽","山岳之脉","江水之精","四季之土","三冬之水","三秋之金","三夏之火","三春之木","煙霧之化","風雲之墟","河漢之邊","星辰之道");
for($j=0;$j<28;$j++) {
	if($selectedDay['cd_28']=="中") {
		$twjcon = $selectedDay['cd_28'].", ".$selectedDay['cd_28j'];
	} else if($selectedDay['cd_28j']==$h28j[$j]) {
		$twjcon = "<img src='".G5_IMG_URL."/28j_".$e28j[$j].".jpg' />";
		$twjcon .= "<h3>".$selectedDay['cd_28'].$selectedDay['cd_28j']."</h3><h3>".$h28j4[$j]."</h3>";
		}
}

function getMonthGanZhi($year, $month) {
    $gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    $zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    $diff = ($year - 2024) * 12 + ($month - 4);
    $g = (($diff % 10) + 10) % 10;
    $z = (($diff % 12) + 12) % 12;
    return $gan[$g] . $zhi[$z];
}

// 방법 1: 년월을 숫자로 비교
$cd_hwmganjee = ($selectedDay['cd_hwy'] > 2024 || ($selectedDay['cd_hwy'] == 2024 && $selectedDay['cd_hwm'] >= 6))
    ? getMonthGanZhi($selectedDay['cd_hwy'], $selectedDay['cd_hwm'])
    : $selectedDay['cd_hwmgj'];
?>
	<div id="calDate" class="round5">
	<?php if($thisTime>=2300&&$thisTime<=2359) { ?>
		<?php echo $nextDay['cd_hwy']?>.<?php echo $nextDay['cd_hwm']?>.<?php echo $nextDay['cd_hwd']?> <?php echo $wHj?>
		(<?php echo $hwgjNext['cd_hyganjee']?>年 <?php echo $nextDay['cd_hwmgj']?>月 <?php echo $nextDay['cd_hdganjee']?>日)
	<?php } else { ?>
		<?php echo $selectedDay['cd_hwy']?>.<?php echo $selectedDay['cd_hwm']?>.<?php echo $selectedDay['cd_hwd']?> <?php echo $wHj?>
		(<?php echo $hwgj['cd_hyganjee']?>年 <?php echo $cd_hwmganjee?>月 <?php echo $selectedDay['cd_hdganjee']?>日)
	<?php } ?>
		<?php echo $selectedDay['cd_jg']?>&nbsp;
<?php
//			echo "<div>";
			if($thisTime>=0&&$thisTime<=2259) $oDN = $tInfo['cd_no'] - 63316;
			else $oDN = $tInfo['cd_no'] - 63315;
//			$oDN = $tInfo['cd_no'] - 63315;
			$oDN5 = $oDN % 5;
			$timeDiv = array("0-59","100-259","300-459","500-659","700-859","900-1059","1100-1259","1300-1459","1500-1659","1700-1859","1900-2059","2100-2259");
			$gj[0] = array("丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥","甲子","乙丑","丙寅","丁卯","戊辰");
			$gj[1] = array("己巳","庚午","辛未","壬申","癸酉","甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰");
			$gj[2] = array("辛巳","壬午","癸未","甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰");
			$gj[3] = array("癸巳","甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯","甲辰");
			$gj[4] = array("乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑","甲寅","乙卯","丙辰");
			for($t=0;$t<12;$t++) {
				$tDate = explode('-',$timeDiv[$t]);
				if($thisTime>=2300&&$thisTime<=2359)
					$thisTimeGj = $gj[$oDN5][0];
				else if($thisTime>=$tDate[0]&&$thisTime<=$tDate[1])
					$thisTimeGj = $gj[$oDN5][$t];
//				else $thisTimeGj = $gj[$oDN5][0];
			}
//			echo "현재시각 ".$thisTimeGj."時";
			$timeDivG = array("0-20","21-140","141-300","301-420","421-540","541-700","701-820","821-940","941-1100","1101-1220","1221-1340","1341-1500","1501-1620","1621-1740","1741-1900","1901-2020","2021-2140","2141-2300");
			for($t=0,$u=$t+1;$t<18;$t++,$u++) {
				$tDateG = explode('-',$timeDivG[$t]);
				if($thisTime>2300&&$thisTime<=2359) {
					$cdTN = "cd_t1";
//					$newNoG = $tInfo['cd_no'] - 63313;
				} else if($thisTime>=$tDateG[0]&&$thisTime<=$tDateG[1]) {
					$cdTN = "cd_t".$u;
//					$newNoG = $tInfo['cd_no'] - 63314;
				}
//					$newNoG = $tInfo['cd_no'] - 63314;
					
					if($thisTime>2300&&$thisTime<=2359) $newNoG = $tInfo['cd_no'] - 63313;
					else $newNoG = $tInfo['cd_no'] - 63314;
					
					$gu = sql_fetch(" select * from cd_gugung where cd_no = '{$newNoG}' ");
					$thisTimeGu = $gu[$cdTN];
					$thisTimeGu = str_replace(".", ",", $thisTimeGu);
			}
			echo "<소궁,대궁>".$thisTimeGu." ";
			echo "현재시각 ".$thisTimeGj."時";
//			echo "</div>";
?>		
		<button class="btn btn-info" id="btn28j"><?php echo $selectedDay['cd_28']?>, <?php echo $selectedDay['cd_28j']?></button>		
		<div id="twjang" class="round5"><?php echo $twjcon?></div>
	</div>

	<table cellspacing="0" cellpadding="0" id='calTable0' align='center'>
		<tr align="center">
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=hw&Dcode=<?php echo $pre_year_real?>-<?php echo $month?>-1"><i class="fa fa-chevron-left"></i></a></td>
			<td><select class="form-control" name="calY" onChange="window.open(value,'_self');">
		<script>
		for(y=1989; y<=2108; y++){
			s = "";
			if(y=='<?php echo $year?>')	s = " selected";
			document.write("<option value='<?php echo G5_URL.'/_calendar/?cal=hw&amp;Dcode='?>"+y+"-<?php echo $month?>-1'"+s+">" + y + "년</option>");
		}
		</script></select></td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=hw&Dcode=<?php echo $nex_year_real?>-<?php echo $month?>-1"><i class="fa fa-chevron-right"></i></a></td>
			<td class="padd5"><a class="btn btn-<?php echo $thisToday?> btn-xs" href='<?php G5_URL?>/_calendar/?cal=hw&Dcode=<?php echo $thisHwy?>-<?php echo $thisHwm?>-<?php echo $thisHwd?>' id='today'>오늘</a></td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=hw&Dcode=<?php echo $pre_year?>-<?php echo $pre_month?>-1"><i class="fa fa-chevron-left"></i></a></td>
			<td><select class="form-control" name="calM" onChange="window.open(value,'_self');">
		<script>
		for(n=1; n<=12; n++){
			s = "";
			if(n=='<?php echo $month?>') s = " selected";
			document.write("<option value='<?php echo G5_URL.'/_calendar/?cal=hw&amp;Dcode='.$year.'-'?>"+n+"-1'"+s+">" + n + "월</option>");
		}
		</script></select></td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_calendar/?cal=hw&Dcode=<?php echo $nex_year?>-<?php echo $nex_month?>-1"><i class="fa fa-chevron-right"></i></a></td>
		</tr>
	</table>
	<?/****/?>
	<div id="calendarBox">
		<table id="calTable"  class="table table-bordered">
			<thead>
				<tr class="warning">
					<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
				</tr>
			</thead>
			<tbody>
<?php
for($d=0; $row_date=sql_fetch_array($result_date); $d++) {
	if($d%7==0||$d==0) echo "<tr>";
	$tdClass[$d] = "";
	$noneDay[$d] = " fwB";
	if($row_date['cd_hwm']!=$month) {
		$tdClass[$d] = "active";
		$noneDay[$d] = " noneDay";
	}
	$this_today[$d] = "";
	if($row_date['cd_hwy']==$thisHwy&&$row_date['cd_hwm']==$thisHwm&&$row_date['cd_hwd']==$thisHwd) $this_today[$d] = " success";
	
	$Cganji[$d] = "";
	if($row_date['cd_hdganjee']==$selectedDay['cd_hdganjee'])
		$Cganji[$d] = "Sel";
	
	$sd[$d] = $row_date['cd_sd'];
	$sDaySel[$d] = "";
	if($row_date['cd_sd']==1) {
		$sd[$d] = "<b>".$row_date['cd_sm'].".".$row_date['cd_sd']."</b>";
		$sDaySel[$d] = "Sel";
	}
	
	$hd[$d] = $row_date['cd_hwd'];
	$hDaySel[$d] = "";
	if($row_date['cd_hwd']==1) {
		$hd[$d] = "<b>".$row_date['cd_hwm'].".".$row_date['cd_hwd']."</b>";
		$hDaySel[$d] = "Sel";
	}
?>
					<td class="calTd <?php echo $tdClass[$d].$this_today[$d]?>" rel="<?php echo $row_date['cd_hwy'].'-'.$row_date['cd_hwm'].'-'.$row_date['cd_hwd'].'-'.$cal?>">
						<span class='sDay<?php echo $noneDay[$d]?>'><?php echo $row_date['cd_hwd']?></span>
						<div class='sDay<?php echo $sDaySel[$d]?> round5'><?php echo $sd[$d]?></div>
						<div class='hwganji<?php echo $Cganji[$d]?> round5'><?php echo $row_date['cd_hdganjee']?></div>
						<div class='etcR'>
							<strong class='Cnavy'><?php echo $row_date['cd_8']?></strong><br />
							<?php echo $row_date['cd_28']?>, <?php echo $row_date['cd_28j']?><br />
							<?php echo $row_date['cd_etc1']?><br /><?php echo $row_date['cd_etc2']?>
						</div>
					</td>

<?php } ?>
			</tbody>
		</table>
	</div>
	<?/****/?>

<?php } } ?>
<?php if(!$calendar_id) { ?>
	<div id="cal-notice" class="round5">
		<?php
			$boCal = get_board('calendar');
			$calCateList = explode('|',$boCal['bo_category_list']);
			$is_where = "wr_is_comment = 0 and ca_name = '{$calCateList[0]}' ";
			$calNo = sql_query(" select * from {$calendar_table} where {$is_where} order by wr_1 desc ");
			for($n=0;$row=sql_fetch_array($calNo);$n++) {
				$wrUp = sql_fetch(" select wr_id,wr_1 from {$calendar_table} where {$is_where} and wr_1 > '{$row['wr_1']}' order by wr_1 limit 0,1 ");
				$wrDn = sql_fetch(" select wr_id,wr_1 from {$calendar_table} where {$is_where} and wr_1 < '{$row['wr_1']}' order by wr_1 desc limit 0,1 ");
				$disabledUp = $disabledDn = "";
				if(!$wrUp['wr_1']) $disabledUp = ' disabled="disabled"';
				if(!$wrDn['wr_1']) $disabledDn = ' disabled="disabled"';
		?>
		<li>
			<a class="list" href="<?php echo G5_URL?>/_calendar/?cal=<?php echo $cal?>&calendar_id=<?php echo $row['wr_id']?>&calCate=<?php echo $row['ca_name']?>"><?php echo $row['wr_subject']?></a>
			<?php if($is_admin=='super') { ?>
			<div class="tool">
				<?php /****?>
				<button class="btn btn-info btn-xs moveWr" rel="calendar:<?php echo $row['wr_id']?>:<?php echo $row['wr_1']?>:<?php echo $wrUp['wr_id']?>:<?php echo $wrUp['wr_1']?>"<?php echo $disabledUp?>><i class="fa fa-arrow-up"></i></button>
				<button class="btn btn-warning btn-xs moveWr" rel="calendar:<?php echo $row['wr_id']?>:<?php echo $row['wr_1']?>:<?php echo $wrDn['wr_id']?>:<?php echo $wrDn['wr_1']?>"<?php echo $disabledDn?>><i class="fa fa-arrow-down"></i></button>
				<?php /****/?>
				<a class="btn btn-info btn-xs" href="./?act=moveWr&dataInfo=<?php echo $row['wr_id']?>:<?php echo $row['wr_1']?>:<?php echo $wrUp['wr_id']?>:<?php echo $wrUp['wr_1']?>&pageUrl=<?php echo urlencode($_SERVER['REQUEST_URI'])?>"<?php echo $disabledUp?>><i class="fa fa-arrow-up"></i></a>
				<a class="btn btn-warning btn-xs" href="./?act=moveWr&dataInfo=<?php echo $row['wr_id']?>:<?php echo $row['wr_1']?>:<?php echo $wrDn['wr_id']?>:<?php echo $wrDn['wr_1']?>&pageUrl=<?php echo urlencode($_SERVER['REQUEST_URI'])?>"<?php echo $disabledDn?>><i class="fa fa-arrow-down"></i></a>
			</div>
			<?php } ?>
		</li>
		<?php } ?>
	</div>
<?php } ?>
		<h2 id="ganjee" class="badge"><?php if($calCate) echo $calCate; else echo $selectedDay['cd_hdganjee']?></h2>
<?php
if($calendar_id) {
// 수정, 삭제 링크
$update_href = $delete_href = '';
// 로그인중이고 자신의 글이라면 또는 관리자라면 패스워드를 묻지 않고 바로 수정, 삭제 가능
if (($member['mb_id']&&($member['mb_id']==$calWrInfo['mb_id']))||$is_admin) {
    $update_href = G5_BBS_URL.'/write.php?w=u&amp;bo_table=calendar&amp;wr_id='.$calendar_id.'&amp;page='.$page;
    $delete_href = G5_BBS_URL.'/delete.php?bo_table=calendar&amp;wr_id='.$calendar_id.'&amp;page='.$page;
    if ($is_admin)
    {
//        set_session("ss_delete_token", $token = uniqid(time()));
		$token = get_session('ss_delete_token');
        $delete_href = G5_BBS_URL.'/delete.php?bo_table=calendar&amp;wr_id='.$calendar_id.'&amp;token='.$token.'&amp;page='.$page;
    }
}
	$commentNum = "";
	if($calWrInfo['wr_comment']>0) $commentNum = "<span class='comment-num'>".$calWrInfo['wr_comment']."</span>";
	$sVW = sql_fetch(" select vi_view from g5_visit where vi_ip = '{$_SERVER['REMOTE_ADDR']}' ");
	$con = explode("[Img:",$calWrInfo['wr_content']);
	$cnt = count($con);
	$wrContent = $con[0];
	for($i=1;$i<$cnt;$i++)
	{
		$con2 = explode("]",$con[$i]);
		$pId = $con2[0];
		$pCode = "[Img:".$pId."]";
		$pInfo = sql_fetch(" select * from gpf_picasa where id = '{$pId}' ");
		$imgWidth = $pInfo['width'];
		$imgWidthDiv = $pInfo['width']."px";
		if($sVW['vi_view']<$pInfo['width']) {
			$imgWidth = "100%";
			$imgWidthDiv = "100%";
		} //$sVW['vi_view'];
		$pHtml = "<div class='photoBoxSqare' style='width:".$imgWidthDiv."' id='BB".$pId."'>".PHP_EOL;
//		$pHtml = "<img src='".$pInfo['imgurl']."' class='sect-photo' id='".$pId."'>".PHP_EOL;
		$pHtml .= "<img src='".$pInfo['imgurl']."' width='".$imgWidth."' class='lazyload' id='".$pId."'>".PHP_EOL;
		if($pInfo['summary']) $pHtml .= "<i class='fa fa-th-large'></i> ".$pInfo['summary'].PHP_EOL;
		$pHtml .= "</div>".PHP_EOL;
		$conPart = "[Img:".$con[$i];
		$wrContent .= str_replace($pCode, $pHtml, $conPart);
	}
	$rowDatetime10 = substr($calWrInfo['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = substr($calWrInfo['wr_datetime'],11,8);
	else
		$rowDatetime = $rowDatetime10;
	?>
	
	<div id="sqView">
		<div id="title">
			<h1 id="subject"><?php echo $calWrInfo['wr_subject']?></h1>
			<span id="name"><?php echo $calWrInfo['wr_name']?></span>
			<a class="btn btn-default btn-xs" href="javascript:;" onclick="window.open('<?php echo G5_BBS_URL?>/memo_form.php?me_recv_mb_id=<?php echo $calWrInfo['mb_id']?>','name','resizable=no,width=550,height=500,status=no,scrollbars=yes,menubar=no');return false"><i class="fa fa-envelope-o"></i> 쪽지</a>
			<span id="cate"><?php echo $calWrInfo['ca_name']?></span>
			<span id="dateTime"><?php echo $rowDatetime?></span>
			<span class="wrHit round5"><?php echo number_format($calWrInfo['wr_hit'])?></span>
		</div>
		<div class='toolBox'>
		<?php if($member['mb_id']==$calWrInfo['mb_id']||$is_admin=='super') { ?>
			<a class='btn btn-success' type='button' href='<?php echo $update_href?>'>수정</a>
			<a class='btn btn-danger' type='button' href='<?php echo $delete_href?>' onclick='del(this.href); return false;'>삭제</a>
		<?php } ?>
			<div class="padd10">
				<a type="button" class="btn btn-default scroll openCommentBox" href="#openCommentBox2" id="openCommentBox1" rel="calendar:<?php echo $calendar_id?>"><i class="fa fa-comment fa-2x"></i> <span class='commentNum' id='wrId<?php echo $calendar_id?>'><?php echo $commentNum?></span></a>
			</div>
		</div>
		<div id="sqContent">
		<?php echo $wrContent?>
		</div>
		<div class='toolBox'>
		<?php if($member['mb_id']==$sectWrInfo['mb_id']||$is_admin=='super') { ?>
			<a class='btn btn-success' type='button' href='<?php echo $update_href?>'>수정</a>
			<a class='btn btn-danger' type='button' href='<?php echo $delete_href?>' onclick='del(this.href); return false;'>삭제</a>
		<?php } ?>
			<div class="padd10 txtR">
				<button type="button" class="btn btn-default openCommentBox" id="openCommentBox2" rel="calendar:<?php echo $calendar_id?>"><i class="fa fa-comment fa-2x"></i> <span class='commentNum' id='wrId<?php echo $calendar_id?>'><?php echo $commentNum?></span></button>
			</div>
		</div>
		<div class="txtC padd10 cl-bo dispN" id="iconLoading"><img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" /></div>
		<div id="wrCommentsBox" class="cl-bo<?php if($mode=='openComment') { ?> open<?php } ?>">
			<?php if($mode=='openComment') include G5_PATH."/inc_commentList.php" ?>
		</div>
		<div id="subjCateListBoxWrap" class="round5">
			<h2><i class="fa fa-list-ul"></i> <?php if($cal=='hw') { ?>황극력<?php } else if($cal=='df') { ?>선천력<?php } ?> / <?php echo $calCate?></h2>
			<img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" id="subjCateListLoading" />
			<div id="subjCateListBox" class="innerPaging">
			<?php include G5_PATH."/inc_subjCateList.php";?>
			</div>
		</div>
	</div><!-- id="sqView"-->
<?php
//조회수 증가
$ss_name = 'ss_view_calendar_'.$calendar_id;
if (!get_session($ss_name))
{
	sql_query(" update {$calendar_table} set wr_hit = wr_hit + 1 where wr_id = '{$calendar_id}' ");
	// 자신의 글이면 통과
	if ($calWrInfo['mb_id']&&$calWrInfo['mb_id'] == $member['mb_id']) {
	;
	} else if ($is_guest&&$calWrInfo['wr_ip']==$_SERVER['REMOTE_ADDR']) {
	// 비회원이면서 등록된 아이피가 같다면 자신의 글이므로 통과
	;
	}
	set_session($ss_name, TRUE);
}
} else { //$calendar_id가 없을 때 
?>

		<div id="mainSect">
			<div id="calendarSectBox" class="innerPaging">
				<?php include G5_PATH."/inc_calendarSect.php";?>
			</div>
		</div>
<?php } ?>

</div><!-- id="sqCon"-->

<!--div id="sqSub" class="<?php if(!G5_IS_MOBILE) { ?>sqSubAbs<?php } else { ?>sqSubFix<?php } ?>"-->
<div id="sqSub" class="sqSubAbs">
	<button class="btn btn-default hideSub"><i class="fa fa-times"></i></button>
	<div id="commentsBox">
		<h3 id="sub-title"><i class="fa fa-comments fa-2x"></i> 달력 전체 댓글</h3>
		<div id="commentsBoxWrap" class="commList">
			<?php include G5_PATH."/inc_commentBox.php";?>
		</div>
	</div>
</div><!-- id="sqSub"-->

<?php
include_once(G5_PATH.'/_tail.php');
?>