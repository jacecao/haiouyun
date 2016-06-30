	<?php
		header('Content-Type:text/html;charset=utf-8');

		define('DB_HOST','localhost');
		define('DB_USER','root');
		define('DB_PWD','seagull');
		define('DB_NAME','blog');
		$con = mysqli_connect("localhost","root","seagull");
		if (!$con)
		  {
		  die('Could not connect: ' . mysql_error());
		  }
		mysqli_select_db($con,'blog');
		mysqli_query($con,"set names 'utf8'");
		$pass = sha1($_POST['login_pass']);
		$query = "SELECT user FROM blog_user WHERE user='{$_POST['login_user']}' AND pass='{$pass}'";
		$flag = mysqli_query($con,$query) or die('SQL出错');
		
		sleep(3); //模拟网络延迟
		if( mysqli_fetch_array($flag,MYSQLI_ASSOC) )
		{
			echo 1; //有数据返回
		}else{
			echo 0; //无数据返回
		}
		mysqli_close($con);

	?>