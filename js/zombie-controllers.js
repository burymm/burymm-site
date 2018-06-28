/**
 * Created by nikolay.bury on 27.03.14.
 */

function ZombieGameController($scope) {
    // settings
    $scope.game = {
        version: '0.0.1',
        humans: 10
    };
    $scope.field = {
        width: 30,
        height: 30,
        cellSize: 10
    }
    // end settings

    var time = 0,
        gameTimer;

    function Virus() {
        return {
            damage: 5
        };
    };

    function Human() {
        var position = {
                x: Math.floor(Math.random() * $scope.field.width) * $scope.field.cellSize,
                y: Math.floor(Math.random() * $scope.field.height) * $scope.field.cellSize
            },
            isInfected = false,
            health = 100,
            maxHealth = 100,
            immunity = 0.1,
            isDie = false;

        function move(newX, newY) {
            if (isInfected) {
                if (health > 0) {
                    health -= virus.damage * (1 - immunity);
                    position.x = newX;
                    position.y = newY;
                } else {
                    isDie = true;
                }
            }
        };

        return {
            position: position,
            maxHealth: maxHealth,
            health: health,
            damage: 0,
            speed: 200,
            immunity: immunity,
            move: move,
            isInfected: isInfected
        }
    };

    function Zombie(human) {
        var zombie = human;
        zombie.damage = human.damage * 1.2 + 1;
        zombie.speed  = human.speed * 0.7;

        return zombie;
    }

    $scope.renderMap = function() {
        var $map = $('#field');
        $map.html('');
        _.each($scope.humans, function(human) {
            var $human = $('<div class="human">H</div>');
            $human.css({top: human.position.y, left: human.position.x});
            $map.append($human);
        });
    };

    function gameCycle() {
        var isMapUpdate = false;
        _.each($scope.humans, function(human) {
            var timeMove = ($scope.field.cellSize / human.speed).toFixed(4) * 1000;
            if (time % timeMove == 0) {
                // human can move on one cell in each direction
                human.position.x += (Math.floor(Math.random() * 3) - 1) * $scope.field.cellSize;
                human.position.y += (Math.floor(Math.random() * 3) - 1) * $scope.field.cellSize
                isMapUpdate = true;
            }
        });

        time += 1;
        if (isMapUpdate) {
            $scope.renderMap();
        }

    }

    $scope.newGame = function() {
        var humans = [];
        for (var i = 0; i < $scope.game.humans; i += 1) {
            humans.push(new Human());
        }
        $scope.humans = humans;

        // render map
        $scope.renderMap();


        time = 0;
        gameTimer = setInterval(gameCycle, 1);
        console.log($scope.humans);
    }


}
