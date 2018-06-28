/**
 * Created by nikolay.bury on 9/26/13.
 */

var app = angular.module('HomeSite', []).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {templateUrl: 'partials/home.html',   controller: HomeController}).
            when('/home', {templateUrl: 'partials/home.html',   controller: HomeController}).

            when('/projects', {templateUrl: 'partials/projects.html',   controller: HomeController}).
            when('/projects/salary-calculator', {templateUrl: 'partials/salary-calculator.html',   controller: SalaryController}).
            when('/projects/canvas-clock', {templateUrl: 'partials/canvas-clock.html',   controller: NoController}).
            when('/projects/name-converter', {templateUrl: 'partials/name-converter.html',   controller: ConverterController}).
            when('/games/kill-bourgeois', {templateUrl: 'partials/kill_bourgeois.html',   controller: KillBourgeoisGameController}).
            when('/projects/imei-generator', {templateUrl: 'partials/imei-generator.html',   controller: IMEIGenerator}).
            when('/projects/berezino', {
                templateUrl: 'partials/berezino-phones.html',
                controller: BerezinoPhonesController,
                reloadOnSearch: false,
            }).
            when('/projects/make-json', {templateUrl: 'partials/make-json.html',   controller: MakeJSON}).
            when('/projects/rubel-cost', {templateUrl: 'partials/rubel-cost.html',   controller: RubelCostController}).
            when('/thanks', {templateUrl: 'partials/thanks-page.html',   controller: ThanksController}).
            when('/404', {templateUrl: 'partials/404.html',   controller: ErrorController}).
            otherwise({redirectTo: '/404'});

        //$locationProvider.html5Mode(true);
        //$locationProvider.hashPrefix('!');
    }]);


app.directive('shortcut', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        link:    function postLink(scope, iElement, iAttrs){
            jQuery(document).on('keypress', function(e){
                scope.$apply(scope.keyPressed(e));
            });
        }
    };
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

function MasterController($scope, $timeout) {
    $scope.navMenu = Data.navigationMenu;

    $scope.updateShowingMenu = function (options) {
        if (options.showing) {
            $scope.isShowMenu = "showing";
        } else {
            $scope.isShowMenu = "not-showing";
        }
    };

    $scope.updateSlogan = function() {
      $scope.currentSlogan = Data.slogans[Math.floor(Math.random() * Data.slogans.length)];
      timer = $timeout($scope.updateSlogan, updateTime);
    };

    //$scope.updateSlogan();

    var updateTime = 5000,
        timer = $timeout($scope.updateSlogan, 0);
};


function HomeController($scope) {

};

function ProjectsController($scope) {
    $scope.projectList = Data.projectList;
}

function SalaryController($scope, $timeout) {

    $scope.application = {
        version: '1.35'
    };

    function calculateSalary(user, options) {
        var today = new Date(),
            beginMonthDate = new Date(today.getFullYear(), today.getMonth(), 1),
            endMonthDate = new  Date(today.getFullYear(), today.getMonth() + 1, 0);
        user.dayOff = user.dayOff || 0;
        user.salary = user.salary || 0;

        var salary = {};

        salary.salaryPerDay = user.salary / (Utills.workingDaysBetweenDates(beginMonthDate, endMonthDate));
        salary.expectedSalary = (salary.salaryPerDay * (Utills.workingDaysBetweenDates(beginMonthDate, endMonthDate) - user.dayOff)).toFixed(2);
        salary.salaryForToday  = salary.salaryPerDay * (Utills.workingDaysBetweenDates(beginMonthDate, new Date()) - user.dayOff);

		if (salary.salaryForToday < 0) {
            salary.salaryForToday = 0;
        }

		salary.salaryForToday = salary.salaryForToday.toFixed(2);

        if ((options) && (options.calculateRealTime)) {
            salary.salaryPerSecond = salary.salaryPerDay / 28800;
            var secondLeft = (today.getHours() - 10) * 3600; // work start usually at 9 o'clock

            secondLeft += today.getMinutes() * 60;
            secondLeft += today.getSeconds();
            salary.salaryForNow = salary.salaryPerSecond * secondLeft;
            salary.salaryForNow = salary.salaryForNow.toFixed(4);
            if (salary.salaryForNow > salary.salaryForToday) {
                salary.salaryForNow = salary.salaryForToday;
            }
            if (salary.salaryForNow < 0) {
                salary.salaryForNow = 0;
            }
        } else {

        }

        return salary;

    }

    $scope.calculateSalaryToday = function(user) {
        var salary = calculateSalary(user);
        $scope.salaryPerDay = salary.salaryPerDay;
        $scope.expectedSalary = salary.expectedSalary;
        $scope.salaryForToday = salary.salaryForToday;

        localStorage.setItem('user', JSON.stringify(user));
    };



    $scope.realTimeCalculationClick = function(user) {

        realTimeCalculation = function() {
            var salary = calculateSalary(user, {calculateRealTime: true});
            $scope.salaryPerDay = salary.salaryPerDay;
            $scope.expectedSalary = salary.expectedSalary;
            $scope.salaryForToday = salary.salaryForToday;
            $scope.salaryForNow = salary.salaryForNow;

            console.log('tick');
            $timeout(realTimeCalculation, 1000);
        };

        $timeout(realTimeCalculation, 1000);
        localStorage.setItem('user', JSON.stringify(user));
    };

    $scope.salaryDataInit = function() {
        var user = localStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            Utills.debug('[$scope.user]', user);
        }
        $scope.user = user || {};
        $scope.calculateSalaryToday($scope.user);
    }

}


function ConverterController($scope) {
    $scope.version = '1.4';
    $scope.isShowedClipboard = false;

    $scope.param =  {
        changes : 3,
        convertName: '',
        namePattern: /^[a-zA-Zа-яА-Я ]+$/
    }

    function getKey2(word, key) {
        var vowels = 'eyuioaуеыаоэяию',
            key2;
        key2 = Math.floor(Math.random() * word.length);
        if (vowels.indexOf(word[key].toLowerCase()) > 0) {
            while (vowels.indexOf(word[key2].toLowerCase()) == -1) {
                key2 = Math.floor(Math.random() * word.length);
            }
        }   else {
            while (vowels.indexOf(word[key2].toLowerCase()) != -1) {
                key2 = Math.floor(Math.random() * word.length);
            }
        }
        return key2;
    }


    function caseUpdate(word) {
        var upperCasePattern = /[A-ZА-Я]/,
            str = word;
        if (upperCasePattern.test(word)) {
            str = word.toLowerCase();
            str = Utills.replaceAt(str, 0, str[0].toUpperCase());
        }

        return str;
    }

    $scope.convert = function(param) {
        param.changes = param.changes || 3;
        if (param.convertName) {
            // save begging name
            if (!param.savedName) {
                param.savedName = param.convertName;
            }

            // restore
            var words = param.convertName.split(' ');
            for (var i = 0; i < words.length; i += 1) {

                for (var count = 0; count < param.changes; count += 1) {
                    // get keys
                    var key1 = Math.floor(Math.random() * words[i].length),
                        key2 = getKey2(words[i], key1); // Math.floor(Math.random() * words[i].length);

                    // change chars
                    var bufferChar = words[i][key1];
                    words[i] = Utills.replaceAt(words[i], key1, words[i][key2]);
                    words[i] = Utills.replaceAt(words[i], key2, bufferChar);
                    words[i] = caseUpdate(words[i]);
                }
            }
            param.convertName = words.join(' ');
        }
    }

    $scope.saveName = function(param) {
        if (param.namePattern.test(param.convertName)) {
            param.savedName = param.convertName;
        }
    }

    $scope.restoreName = function(param) {
        if (param.savedName) {
            param.convertName = param.savedName;
        }
    }

    $scope.showClipboard = function() {
        //$scope.isShowedClipboard = true;
    }

    $scope.hideClipboard = function() {
        $scope.isShowedClipboard = false;
    }

    $scope.copyToClipboard = function($event, data) {
        Utills.debug($event, $event.clipboardData);
    }

}



function NoController($scope) {
    $scope.canvasClockInit = function() {
        $('#div-canvas-clock').canvasClock({radius: 50});
    }
}


function KillBourgeoisGameController($scope, $timeout) {
    var BOX_SIZE = 60,
        MAP_HEIGHT_SIZE = 460,
        MAP_WIDTH_SIZE = 640,
        CRITICAL_MULTIPLIER = 3,
        SPEED = 600,
        MAX_LEVEL = 10,
        squaresY = Math.floor(MAP_HEIGHT_SIZE / BOX_SIZE),
        squaresX = Math.floor(MAP_WIDTH_SIZE / BOX_SIZE),
        action = '',
        Damage = function(min, max, criticalChance) {
            return {
                min: min,
                max: max,
                criticalChance: criticalChance,
                getDamage: function() {
                    var value = this.min,
                        isCritical = false;
                    if (Math.floor(Math.random() * Math.floor(100 / this.criticalChance)) == 0) {
                        // if critical hit
                        value = this.max * CRITICAL_MULTIPLIER;
                        isCritical = true;
                    } else {
                        value = Math.floor((this.max - this.min) * Math.random()) + this.min;
                    }
                    return {value: value, isCritical: isCritical};
                }
            }
        },
        DAMAGE_TYPES = {
            melee: 0,
            weapon: 1
        },
        WEAPON_TYPES = {
            types: [
            {
                name: 'melee',
                type: 0,
                damage: new Damage(1, 5, 10),
                level: 1
            },
            {
                name: 'riffle',
                type: 1,
                damage: new Damage(50, 100, 20),
                level: 5
            }
        ],
            getTypeByName: function(typeName) {
                for (var i = 0; i < this.types.length; i += 1) {
                    if (this.types[i].name == typeName) {
                        return this.types[i];
                    }
                }
                return null;
            }
        },
        MAP = {
            HEIGHT: MAP_HEIGHT_SIZE,
            WIDTH: MAP_WIDTH_SIZE,
            keywords: {
                empty: '0',
                bourgeois: 'b',
                redComrade: 'c',
                deadBourgeois: 'd'
            },
            level: 0
        },
        map = [];

    // init map
    map = new Array(squaresY + 1);
    for (var y = 0; y < squaresY + 1; y += 1) {
        map[y] = new Array(squaresX);
        for (var x = 0; x < squaresX; x += 1) {
            map[y][x] = MAP.keywords.empty;
        }
    }


    // return index of
    var getBourgeoisIndex = function(x, y) {
            var indexes = [];
        for (var i = 0; i < $scope.bourgeoisList.length; i += 1) {
            if (($scope.bourgeoisList[i].x == x) && ($scope.bourgeoisList[i].y == y)) {
                indexes.push(i);
            }
        }
        return indexes;
    },


        getLiveBourgeoisIndex = function(x, y) {
            for (var i = 0; i < $scope.bourgeoisList.length; i += 1) {
                if (($scope.bourgeoisList[i].x == x) && ($scope.bourgeoisList[i].y == y) && !$scope.bourgeoisList[i].dead) {
                    return i;
                }
            }
            return -1;
        },


        canMove = function(x, y) {
            if (map[y][x] == MAP.keywords.empty) {
                return true;
            } else if (map[y][x] == MAP.keywords.bourgeois) {
                var bIndex = getBourgeoisIndex(x, y);
                for (var i = 0; i < bIndex.length; i += 1){ // если хоть один буржуй жив, то не можешь двигатся
                    if (!$scope.bourgeoisList[bIndex[i]].dead) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },


        getLiveBourgeois = function() {
            var count = 0;
            for (var i = 0; i < $scope.bourgeoisList.length; i += 1) {
                if (!$scope.bourgeoisList[i].dead) {
                    count += 1;
                }
            }
            return count;
        },


        addNewBourgeois = function() {
            var newBourgeoisCount = $scope.game.level - getLiveBourgeois();
            for (var i = 0; i < newBourgeoisCount; i += 1) {
                var bourgeois = new Bourgeois();
                bourgeois.init($scope.game.level);
                $scope.bourgeoisList.push(bourgeois);
            }
            //$scope.game.level += 1;
        };


    $scope.game = {
        version: '0.10',
        turns: 0,
        proletarians: 100,
        level: 2,
        kills: 0,
        scores: 0,
        ammoCost: 20,
        isPause: false,
        over: false,
        weaponPower: 3
    };




    var
        RedComrade = function () {
            return {
                x: 0,
                y: 20,
                damage: [],
                speed: 100,
                ammo: 20,
                money: 0,
                life: 100,
                level: 0,
                exp: 0,
                activeWeapon: WEAPON_TYPES.getTypeByName('melee'), // default value
                nextLevel: 5,
                statistics: [],
                weapons: WEAPON_TYPES,
                isShooting: false,
                isLastHitCritical: false,
                typeAttack: {
                    name: DAMAGE_TYPES[0],
                    type: DAMAGE_TYPES[name]

                },
                criticalChance: 5, // chance in percents
                lastHit: 0,
                init: function (param) {
                    this.x = 0;
                    this.y = Math.floor(Math.random() * squaresY);

                    if (param.debug) {
                        $scope.game.proletarians = 100000;
                        this.ammo = 10000;
                        this.money = 10000;
                    }
                    this.updateStatistics();
                },
                addExperience: function (exp) {
                    this.exp += exp;
                    if (this.exp >= this.nextLevel) {   // level up
                        this.levelUp();
                    }
                },
                levelUp: function() {
                    this.level += 1;
                    //  update weapons damage
                    for (var i = 0; i < this.weapons.types.length; i += 1) {
                        this.weapons.types[i].damage.min += Math.floor(Math.random() * this.weapons.types[i].level) + 1;
                        this.weapons.types[i].damage.max += Math.floor(Math.random() * this.weapons.types[i].level) + 2;
                    }
                    // increase proletarians
                    $scope.game.proletarians += $scope.game.level * (Math.floor(Math.random() * 10) + 10);

                    // increase difficult
                    $scope.game.level += 1;
                    // value exp to next level
                    this.nextLevel = Math.floor(this.nextLevel * 1.6);
                    this.updateStatistics();
                },
                hitBourgeois: function (x, y, bourgeoisIndex) {
                    var bourgeoisIndex = bourgeoisIndex || getLiveBourgeoisIndex(x, y),
                        damage = this.activeWeapon.damage.getDamage();

                    if (bourgeoisIndex >= 0) {
                        $scope.bourgeoisList[bourgeoisIndex].hit(damage.value);
                        this.lastHit = damage.value;
                        this.isLastHitCritical = damage.isCritical;

                        if ($scope.bourgeoisList[bourgeoisIndex].dead) {
                            this.money += $scope.bourgeoisList[bourgeoisIndex].money;
                            addNewBourgeois();
                            $scope.game.kills += 1;
                            $scope.game.scores += $scope.bourgeoisList[bourgeoisIndex].weight;
                            this.addExperience($scope.bourgeoisList[bourgeoisIndex].weight);
                            //map[y][x] = MAP.keywords.deadBourgeois;
                        }
                    }
                },
                moveUp: function () {
                    this.activeWeapon = WEAPON_TYPES.getTypeByName('melee');
                    if ($scope.redComrade.y > 0) {
                        if (canMove(this.x, this.y - 1)) {
                            this.y -= 1;
                        } else {
                            if (map[this.y - 1][this.x] == MAP.keywords.bourgeois) {
                                this.hitBourgeois(this.x, this.y - 1);
                            }
                        }
                    }
                },
                moveDown: function () {
                    this.activeWeapon = WEAPON_TYPES.getTypeByName('melee');
                    if ($scope.redComrade.y < squaresY) {
                        if (canMove(this.x, this.y + 1)) {
                            this.y += 1;
                        } else {
                            if (map[this.y + 1][this.x] == MAP.keywords.bourgeois) {
                                this.hitBourgeois(this.x, this.y + 1);
                            }
                        }
                    }
                },
                getX: function () {
                    return this.x * BOX_SIZE;
                },
                getY: function () {
                    return this.y * BOX_SIZE;
                },
                shoot: function(param) {
                    var param = param || {direction: 'forward'};

                    if (!param.weapon) {
                        param.weapon = WEAPON_TYPES.getTypeByName('riffle');
                    }

                    if (this.ammo > 0) {
                        // отнимаем потрон
                        this.activeWeapon = param.weapon;
                        this.isShooting = true;
                        this.ammo -= 1;

                        switch (param.direction) {
                            case 'up':
                                for (var y = this.y; y >= 0; y -= 1) {
                                    // суть такая. Находим первую группу буржуев
                                    // ищем живых, если есть стреляем,
                                    // если нет ищем дальше
                                    // если не нашли до конца - выходим
                                    if (map[y][this.x] == MAP.keywords.bourgeois) {
                                        var bourgeoisIndex = getLiveBourgeoisIndex(this.x, y);
                                        if (bourgeoisIndex >= 0) {
                                            this.hitBourgeois(this.x, y, bourgeoisIndex);
                                            break;
                                        }
                                    }
                                }

                                break;
                            case 'down':
                                for (var y = this.y; y <= squaresY; y += 1) {
                                    if (map[y][this.x] == MAP.keywords.bourgeois) {
                                        var bourgeoisIndex = getLiveBourgeoisIndex(this.x, y);
                                        if (bourgeoisIndex >= 0) {
                                            this.hitBourgeois(this.x, y, bourgeoisIndex);
                                            break;
                                        }
                                    }
                                }

                                break;
                            case 'forward':
                                for (var x = 0; x < squaresX; x += 1) {
                                    if (map[this.y][x] == MAP.keywords.bourgeois) {
                                        var bourgeoisIndex = getLiveBourgeoisIndex(x, this.y);
                                        if (bourgeoisIndex >= 0) {
                                            this.hitBourgeois(x, this.y, bourgeoisIndex);
                                            break;
                                        }
                                    }
                                }
                                break;
                        }
                    }
                },
                addAmmo: function(incomeAmmo) {
                    this.ammo += incomeAmmo;
                },
                updateStatistics: function() {
                    this.statistics = [];
                    this.statistics.weaponTypes = this.weapons.types;
                },
                hitForward: function() {
                    this.activeWeapon = WEAPON_TYPES.getTypeByName('melee');
                    if (map[this.y][this.x + 1] == MAP.keywords.bourgeois) {
                        this.hitBourgeois(this.x + 1, this.y, this.activeWeapon.type);
                    }
                },
                switchActiveWeapon: function() {
                    if (this.activeWeapon.type < this.weapons.types.length - 1) {
                        this.activeWeapon = this.types[this.activeWeapon.type + 1];
                    } else {
                        this.activeWeapon = this.weapons.types[0];
                    }
                },
                upAction: function() {
                    switch(this.activeWeapon.name) {
                        case 'melee':
                                this.moveUp();
                            break;
                        case 'riffle':
                                this.shoot({direction: 'up'});
                            break;

                    }
                },
                downAction: function() {
                    switch(this.activeWeapon.name) {
                        case 'melee':
                            this.moveDown();
                            break;
                        case 'riffle':
                            this.shoot({direction: 'down'});
                            break;

                    }
                },
                buyAmmo: function(ammoNeed) {
                    if (this.money >= ammoNeed * $scope.game.ammoCost) {
                        this.addAmmo(ammoNeed);
                        this.money -= ammoNeed * $scope.game.ammoCost;
                    }
                }



            }
        };

    var Bourgeois = function() {
      return {
          x: squaresX,
          y: 0,
          dead: true,
          life: 100,
          weight: 2,
          isHitting: false,
          money: 0,
          move: function() {
              // если не край карты или не стоит красный товарищ
              if ((this.x >  0) )  {
                  if (!(this.x - 1 == $scope.redComrade.x && this.y == $scope.redComrade.y )) {
                      map[this.y][this.x] = MAP.keywords.empty;
                      this.x -= 1;
                      map[this.y][this.x] = MAP.keywords.bourgeois;
                  }
              } else {
                  $scope.game.proletarians -= this.weight;
                  this.money += Math.floor(this.weight / 2);
              }
              this.isHitting = false;
          },
          getX: function() {
              return this.x * BOX_SIZE;
          },
          getY: function() {
              return this.y * BOX_SIZE;
          },
          init: function(level) {
              level = level || 0;
              this.x = squaresX;
              this.y = Math.floor(Math.random() * (squaresY + 1));
              this.weight = Math.floor(level * Math.random()) + 1;
              this.life = Math.floor(50 * level * Math.random()) + 10;
              map[this.y][this.x] = MAP.keywords.bourgeois;
              this.money = this.weight * 5;
              this.dead = false;
          },
          hit: function(damage) {
            this.life -= damage;
            this.isHitting = true;
              if (this.life <= 0) {
                  this.dead = true;
                  this.isHitting = false;
              }
          }
      };
    };




    $scope.bourgeoisList = [];
    for (var i = 0; i < $scope.game.level; i += 1) {
        var bourgeois = new Bourgeois();
        bourgeois.init();
        $scope.bourgeoisList.push(bourgeois);
    }



    var computerPlay = function () {
        //console.log('Turn ', $scope.game.turns);

            if ($scope.game.proletarians < 0) {
                $scope.game.over = true;
                $scope.game.isPause  = true;
                $scope.game.info = {
                    header: 'Game over',
                    content: ['You have ' + $scope.game.kills + ' bourgeois kills',
                        'You have ' + $scope.game.scores + ' scores.']
                };
                //alert('Game over! Score: ' + $scope.game.kills);
            }

        if (!$scope.game.over) {

            if (!$scope.game.isPause) {

                for (var i = 0; i < $scope.bourgeoisList.length; i += 1) {
                    if (!$scope.bourgeoisList[i].dead) {
                        $scope.bourgeoisList[i].move();
                    }
                }

                $scope.game.turns += 1;
            }
            $timeout(computerPlay, SPEED);

            }
        },



        redComradePlay = function() {
            if (!$scope.game.over) {

                if (!$scope.game.isPause) {
                    //console.log(action + '  speed  ' + $scope.redComrade.speed);
                    $scope.redComrade.isShooting = false;

                    switch (action) {
                        case 'moveUp':
                            $scope.redComrade.moveUp();
                            break;
                        case 'moveDown':
                            $scope.redComrade.moveDown();
                            break;
                        case 'shoot':
                            $scope.redComrade.shoot();
                            break;
                        case 'buyAmmo':
                            $scope.redComrade.buyAmmo(2); // ammo count if you buy 'e' key.
                            break;
                        case 'forwardAction':
                            $scope.redComrade.forwardAction();
                            break;
                        case 'switchActiveWeapon':
                            $scope.redComrade.switchActiveWeapon();
                            break;
                        case 'upAction':
                            $scope.redComrade.upAction();
                            break;
                        case 'shootUp':
                            $scope.redComrade.shoot({direction: 'up'});
                            break;
                        case 'shootDown':
                            $scope.redComrade.shoot({direction: 'down'});
                            break;
                        case 'shootForward':
                            $scope.redComrade.shoot({direction: 'forward'});
                            break;
                        case 'hitForward':
                            $scope.redComrade.hitForward();
                            break;
                        case 'downAction':
                            $scope.redComrade.downAction();
                            break;

                    }
                }

                action = '';
                $timeout(redComradePlay, $scope.redComrade.speed);
            }
        }


    $scope.keyPressed = function (e) {
        if (!$scope.game.over) {
            switch (e.which) {
                case 119:
                    action = 'moveUp';
                    //$scope.redComrade.moveUp();
                    break;
                case 105:
                    action = 'shootUp';
                    break;
                case 115:
                    action = 'moveDown';
                    //$scope.redComrade.moveDown();
                    break;
                case 107:
                    action = 'shootDown';
                    break;
                case 108:
                    action = 'shootForward';
                    break;
                case 100:
                    action = 'hitForward';
                    break;
                case 101:
                    action = 'buyAmmo';
                    break;
                case 113:
                    action = 'switchActiveWeapon';
                    break;
                case 112:
                    $scope.game.isPause = !$scope.game.isPause;
                    if ($scope.game.isPause) {
                        $scope.game.info = {
                            header: 'PAUSED',
                            content: [
                                'Press p to resume game.',
                                'Key "w" - to move/hit up',
                                'Key "s" - to move/hit down',
                                'Key "d" - to attack forward melee.',
                                'Key "e" - to buy 2 ammo. 1 ammo cost ' + $scope.game.ammoCost,
                                'Key "i" - shoot up.',
                                'Key "k" - shoot down.',
                                'Key "l" - shoot forward.',
                                '',
                                '',
                                'Game version ' + $scope.game.version
                            ]
                        };
                    }
                    break;
    
            }
    
            //$timeout(computerPlay(), SPEED);
            console.log(e.charCode);
        }
    };

    $scope.Init = function() {

        // init redComrade
        $scope.redComrade = new RedComrade();
        $scope.redComrade.init({debug: false});
        // computer make first move
        computerPlay();
        redComradePlay();
    }
}


function IMEIGenerator($scope, $http) {

    $scope.loadData = function() {
        $http({method: 'GET', url: '/js/data/tacList.json'}).
            success(function(data, status, headers, config) {
                $scope.tacList = data;
            }).
            error(function(data, status, headers, config) {
                $scope.tacList = [{
                    "tac": "86988100",
                    "manufacturer": "ZOPO",
                    "model": "ZP980"
                }];
            });

    }

    $scope.updateIMEI = function() {
        var snr = Math.floor(Math.random() * 999999),
            imei = '' + $scope.tac + snr,
            even = 0,
            odd = 0;

        $scope.imei = '';

        if ($scope.tac.length == 8) {
            for (var i = 0; i < imei.length; i += 1) {
                if (i % 2 == 0) {
                    even += +imei[i];
                } else {
                    var table = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
                    odd += table[+imei[i]];
                }
            }
            if ((even + odd) % 10 == 0) {
                $scope.imei = imei + '0';
            } else {
                $scope.imei = imei + (Math.floor(Math.ceil((even + odd) / 10) * 10) - (even + odd));
            }
        } else if ($scope.tac.length > 8) {
            $scope.tac = $scope.tac.substr(0, 8);
        }
    };

    $scope.imei = '';
    //$scope.tacList = Data.tacList;
}

function BerezinoPhonesController($scope, $http, $routeParams, $location ) {
    const settings = {
        foundLimit: 100
    };

    isPrivateLoaded = false;
    isOrgLoaded = false;

    $scope.version = '3.05';

    $scope.startSearching = function() {
        if (isPrivateLoaded && isOrgLoaded) {
            if ($scope.queryString) {
                $scope.searchPhones($scope.queryString);
            }
        }
    };


    $scope.searchPhones = function(searchQuery) {
        var founded = [];
        searchQuery = searchQuery || '';

        $location.search('query', searchQuery);

        $scope.result = {
            persons: [],
            message: '',
            stopped: false};

        function pushPhone(phone, title, address) {
            var  result = {
                persons: [],
                message: '',
                stopped: false
            };

            founded.push({
                phone: phone,
                title: title,
                address: address
            });

            if (founded.length >= settings.foundLimit) {
                result = {
                    phones: founded,
                    message: 'Found first ' + settings.foundLimit  + ' phones. Please detail your query.',
                    stopped: 'true'
                };
            }
            $scope.result = result;
        }

        function pushPrivatePhone(privatePhone) {
            var phone = privatePhone.phone,
                title = '',
                address = '';

            //create title
            if (privatePhone.lastName) {
                title  += ' ' + privatePhone.lastName;
            }
            if (privatePhone.firstName) {
                title += ' ' + privatePhone.firstName;
            }
            if (privatePhone.middleName) {
                title += ' ' + privatePhone.middleName;
            }


            //create address
            if (privatePhone.city) {
                address  += ' ' + privatePhone.city;
            }
            if (privatePhone.streetType) {
                address += ' ' + privatePhone.streetType;
            }
            if (privatePhone.street) {
                address += ' ' + privatePhone.street;
            }


            pushPhone(phone, title, address);
        }

        function pushOrgPhone(orgPhone) {
            var phone = orgPhone.phone,
                title = '',
                address = '';
            //create title
            if (orgPhone.name) {
                title += ' ' + orgPhone.name;
            }
            if (orgPhone.owner) {
                title += ' ' + orgPhone.owner;
            }
            if (orgPhone.department) {
                title  += ' ' + orgPhone.department;
            }

            // create address
            if (orgPhone.index) {
                address += ' ' + orgPhone.index;
            }
            if (orgPhone.localityType) {
                address += ' ' + orgPhone.localityType;
            }
            if (orgPhone.locality) {
                address += ' ' + orgPhone.locality;
            }
            if (orgPhone.streetType) {
                address += ' ' + orgPhone.streetType;
            }
            if (orgPhone.street) {
                address += ' ' + orgPhone.street;
            }
            if (orgPhone.house) {
                address += ' ' + orgPhone.house;
            }
            pushPhone(phone, title, address);
        }


            // initialize data
            Data.berezinoPhonesOrganization = Data.berezinoPhonesOrganization || {};
            Data.berezinoPhones = Data.berezinoPhones || {};

            for (var orgIndex = 0, orgLength = Data.berezinoPhonesOrganization.length; orgIndex < orgLength; orgIndex += 1) {
                var orgName =  Data.berezinoPhonesOrganization[orgIndex].name || '',
                    overlapName = orgName.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1,
                    orgDepartment = Data.berezinoPhonesOrganization[orgIndex].department || '',
                    overlapDepartment = orgDepartment.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1,
                    orgOwner = Data.berezinoPhonesOrganization[orgIndex].owner || '',
                    overlapOwner = orgOwner.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1,
                    orgPhone = Data.berezinoPhonesOrganization[orgIndex].phone || '',
                    overlapPhone = orgPhone.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1,
                    overlapPhoneWithoutDashes = orgPhone.toUpperCase().replace(/-/g,'').indexOf(searchQuery.toUpperCase().replace(/-/g,'')) > -1;

                if ((overlapName) || (overlapDepartment) || (overlapOwner) || (overlapPhone) || (overlapPhoneWithoutDashes)){
                    pushOrgPhone(Data.berezinoPhonesOrganization[orgIndex]);

                    if ( $scope.result.stopped) {
                        break;
                    }
                }
            }

            if (!$scope.result.stopped) {

                for (var personIndex = 0, personLength = Data.berezinoPhones.length; personIndex < personLength; personIndex += 1) {
                    var privateLastName = Data.berezinoPhones[personIndex].lastName,
                        overlapLastName =  privateLastName.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1,
                        privatePhone = Data.berezinoPhones[personIndex].phone,
                        overlapPhone =  privatePhone.indexOf(searchQuery) > -1,
                        privateStreet = Data.berezinoPhones[personIndex].street,
                        overlapStreet = privateStreet.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1;

                    if ((overlapLastName) || (overlapPhone) || (overlapStreet)) {
                        pushPrivatePhone(Data.berezinoPhones[personIndex]);
                        if ($scope.result.stopped) {
                            break;
                        }
                    }
            }


            if (!$scope.result.stopped) {
                $scope.result = {
                    phones: founded,
                    message: 'Found ' + founded.length + ' phones.'
                };
            }

            }
    };

    $scope.phonesLoadData = function() {
        var orgCount = 0,
            privateCount = 0;
        if (!Data.berezinoPhonesOrganization) {
            $http({method: 'GET', url: '/js/data/data-berezino-organization.json'}).
                success(function(data, status, headers, config) {
                    Data.berezinoPhonesOrganization = data;
                    orgCount = data.length;
                    $scope.phonesCount = orgCount + privateCount;
                    isOrgLoaded = true;
                    $scope.startSearching();
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        if (!Data.berezinoPhones) {
            $http({method: 'GET', url: '/js/data/data-berezino-private.json'}).
                success(function(data, status, headers, config) {
                    Data.berezinoPhones = data;
                    privateCount = data.length;
                    $scope.phonesCount = orgCount + privateCount;
                    isPrivateLoaded = true;
                    $scope.startSearching();
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }





    };

    $scope.keyPressed = function (e) {
            switch (e.which) {
                case 13:
                    $scope.searchPhones($scope.queryString);
                    break;
            }
    };

  if ($routeParams.query) {
    $scope.queryString = $routeParams.query;
  }
}


function MakeJSON($scope) {
    $scope.data = {
        properties: "name;department;owner;index;localityType;locality;streetType;street;house;phone"
    }
    $scope.convertToJSON = function (data) {
        var textArray = data.textToJSON.replace(/(\r\n|\n|\r)/gm, "").split(';'),
            propertyNames = data.properties.split(';'),
            i = 0,
            json = [];
        while (i < textArray.length) {
            var item = {};
            if (((textArray.length - propertyNames.length * json.length) > propertyNames.length) || ((textArray.lenth - propertyNames.length * json.length) % propertyNames.length == 0)) {
                    for (var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex += 1) {
                        item[propertyNames[propertyIndex]] = textArray[i + propertyIndex];
                    }

                    json.push(item);
                }
            i += propertyNames.length;
        }
        $scope.data.JSON = JSON.stringify(json);
    }
}

// controller get data for people who should be thanks

function ThanksController($scope, $http) {
    $scope.loadData = function() {
        $http({method: 'GET', url: '/js/data/thanks.json'}).
            success(function(data, status, headers, config) {
                $scope.persons = data;
            }).
            error(function(data, status, headers, config) {
                $scope.persons = {
                    name: 'Can\'t load data. Sorry.',
                    for: ''
                };
            });
    }
}

function ErrorController($scope, $http) {

}

function RubelCostController($scope, $http) {
    var current = localStorage.getItem('currentCurrency');
    if (!current) {
        $http({method: 'GET', url: 'http://www.nbrb.by/Services/XmlExRates.aspx'}).
            success(function(data, status, headers, config) {
                console.log(data)
            }).
            error(function(data, status, headers, config) {
                console.error('Can\'t load curses');
            });
    }


}

