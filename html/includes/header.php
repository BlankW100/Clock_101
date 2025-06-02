<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?? 'Clock 101'; ?></title>
    <link rel="stylesheet" href="/assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="header-container">
            <a href="/" class="logo">
                <h1>Clock 101</h1>
            </a>
            
            <?php include 'includes/nav.php'; ?>
            
            <div class="user-actions">
                <?php if(isset($_SESSION['user'])): ?>
                    <a href="/account/profile.php" class="user-profile">
                        <img src="<?= $_SESSION['user']['avatar'] ?>" alt="Profile">
                    </a>
                <?php else: ?>
                    <a href="/account/login.php" class="login-btn">Sign In</a>
                <?php endif; ?>
            </div>
        </div>
    </header>