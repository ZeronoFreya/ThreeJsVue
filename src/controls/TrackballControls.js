import * as THREE from "three";

/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */

const TrackballControls = function(object, rect) {
    var _this = this;
    var STATE = {
        NONE: -1,
        ROTATE: 0,
        ZOOM: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_ZOOM_PAN: 4
    };

    this.object = object;
    // API

    this.enabled = true;

    this.screen = rect;

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;

    this.staticMoving = true;
    this.dynamicDampingFactor = 0.2;

    this.minDistance = 0;
    this.maxDistance = Infinity;

    this.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

    // internals

    this.target = new THREE.Vector3();

    var EPS = 0.000001;

    // var lastPosition = new THREE.Vector3();

    var _state = STATE.NONE,
        _prevState = STATE.NONE,
        _eye = new THREE.Vector3(),
        _up = this.object.up.clone(),
        _pos = this.object.position.clone(),
        _movePrev = new THREE.Vector2(),
        _moveCurr = new THREE.Vector2(),
        _lastAxis = new THREE.Vector3(),
        _lastAngle = 0,
        _zoomStart = new THREE.Vector2(),
        _zoomEnd = new THREE.Vector2(),
        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,
        _panStart = new THREE.Vector2(),
        _panEnd = new THREE.Vector2();

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();


    var getMouseOnScreen = (function() {
        var vector = new THREE.Vector2();

        return function getMouseOnScreen(pageX, pageY) {
            vector.set(
                (pageX - _this.screen.left) / _this.screen.width,
                (pageY - _this.screen.top) / _this.screen.height
            );

            return vector;
        };
    })();

    var getMouseOnCircle = (function() {
        var vector = new THREE.Vector2();

        return function getMouseOnCircle(pageX, pageY) {
            vector.set(
                (pageX - _this.screen.width * 0.5 - _this.screen.left) /
                    (_this.screen.width * 0.5),
                (_this.screen.height + 2 * (_this.screen.top - pageY)) /
                    _this.screen.width // screen.width intentional
            );

            return vector;
        };
    })();

    this.rotateOrbit = (function() {
        let up = new THREE.Vector3(0, 1, 0),
            quat = new THREE.Quaternion().setFromUnitVectors(up, up),
            quatInverse = quat.clone().inverse(),
            rotateDelta = new THREE.Vector2(),
            minAzimuthAngle = -Infinity,
            maxAzimuthAngle = Infinity,
            minDistance = 0,
            maxDistance = Infinity,
            minPolarAngle = 0,
            maxPolarAngle = Math.PI,
            spherical = new THREE.Spherical();
            
        return function rotateOrbit() {
            rotateDelta.set(
                _moveCurr.x - _movePrev.x,
                _moveCurr.y - _movePrev.y
            );

            if (rotateDelta.length()) {
                rotateDelta.multiplyScalar(_this.rotateSpeed);
                _eye.copy(_this.object.position).sub(_this.target);
                _up.copy(up);

                // rotate offset to "y-axis-is-up" space
                _eye.applyQuaternion(quat);

                // angle from z-axis around y-axis
                spherical.setFromVector3(_eye);

                // 水平
                spherical.theta -= rotateDelta.x;

                // 垂直
                spherical.phi += rotateDelta.y;

                // restrict theta to be between desired limits
                spherical.theta = Math.max(
                    minAzimuthAngle,
                    Math.min(maxAzimuthAngle, spherical.theta)
                );

                // restrict phi to be between desired limits
                spherical.phi = Math.max(
                    minPolarAngle,
                    Math.min(maxPolarAngle, spherical.phi)
                );

                spherical.makeSafe();

                // restrict radius to be between desired limits
                spherical.radius = Math.max(
                    minDistance,
                    Math.min(maxDistance, spherical.radius)
                );

                _eye.setFromSpherical(spherical);

                // rotate offset back to "camera-up-vector-is-up" space
                _eye.applyQuaternion(quatInverse);

                _movePrev.copy(_moveCurr);
            }
        };
    })();
    this.rotateTrackball = (function() {
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion(),
            eyeDirection = new THREE.Vector3(),
            objectUpDirection = new THREE.Vector3(),
            objectSidewaysDirection = new THREE.Vector3(),
            moveDirection = new THREE.Vector3(),
            angle;

        return function rotateTrackball() {
            moveDirection.set(
                _moveCurr.x - _movePrev.x,
                _moveCurr.y - _movePrev.y,
                0
            );
            angle = moveDirection.length();

            if (angle) {
                _eye.copy(_this.object.position).sub(_this.target);
                _up.copy(_this.object.up);
                eyeDirection.copy(_eye).normalize();

                objectUpDirection.copy(_up).normalize();

                objectSidewaysDirection
                    .crossVectors(objectUpDirection, eyeDirection)
                    .normalize();

                objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
                objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);

                moveDirection.copy(
                    objectUpDirection.add(objectSidewaysDirection)
                );

                axis.crossVectors(moveDirection, _eye).normalize();

                angle *= _this.rotateSpeed;
                quaternion.setFromAxisAngle(axis, angle);

                _eye.applyQuaternion(quaternion);

                _up.applyQuaternion(quaternion);

                _lastAxis.copy(axis);
                _lastAngle = angle;
            } else if (!_this.staticMoving && _lastAngle > 0.0001) {
                _lastAngle *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
                _eye.copy(_this.object.position).sub(_this.target);
                _up.copy(_this.object.up);
                quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
                _eye.applyQuaternion(quaternion);
                _up.applyQuaternion(quaternion);
            }
            _movePrev.copy(_moveCurr);
        };
    })();

    this.rotateCamera = this.rotateOrbit;

    this.zoomCamera = function() {
        var factor;

        if (_state === STATE.TOUCH_ZOOM_PAN) {
            factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
            _touchZoomDistanceStart = _touchZoomDistanceEnd;
            _eye.multiplyScalar(factor);
        } else {
            factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

            if (factor !== 1.0 && factor > 0.0) {
                _eye.multiplyScalar(factor);
            }

            if (_this.staticMoving) {
                _zoomStart.copy(_zoomEnd);
            } else {
                _zoomStart.y +=
                    (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
            }
        }
    };

    this.panCamera = (function() {
        var mouseChange = new THREE.Vector2(),
            objectUp = new THREE.Vector3(),
            pan = new THREE.Vector3();

        return function panCamera() {
            mouseChange.copy(_panEnd).sub(_panStart);

            if (mouseChange.lengthSq()) {
                mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

                pan.copy(_eye)
                    .cross(_this.object.up)
                    .setLength(mouseChange.x);
                pan.add(
                    objectUp.copy(_this.object.up).setLength(mouseChange.y)
                );

                _pos.add(pan);
                _this.target.add(pan);

                if (_this.staticMoving) {
                    _panStart.copy(_panEnd);
                } else {
                    _panStart.add(
                        mouseChange
                            .subVectors(_panEnd, _panStart)
                            .multiplyScalar(_this.dynamicDampingFactor)
                    );
                }
            }
        };
    })();

    this.checkDistances = function() {
        if (!_this.noZoom || !_this.noPan) {
            if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {
                _pos.addVectors(
                    _this.target,
                    _eye.setLength(_this.maxDistance)
                );
                _zoomStart.copy(_zoomEnd);
            }

            if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {
                _pos.addVectors(
                    _this.target,
                    _eye.setLength(_this.minDistance)
                );
                _zoomStart.copy(_zoomEnd);
            }
        }
    };
    this.getCamera = function () {

        _eye.subVectors(_this.object.position, _this.target);

        if (!_this.noRotate) {
            _this.rotateCamera();
        }

        if (!_this.noZoom) {
            _this.zoomCamera();
        }

        if (!_this.noPan) {
            _this.panCamera();
        }
        _pos.addVectors(_this.target, _eye);

        _this.checkDistances();

        // _this.object.lookAt(_this.target);

        // if (lastPosition.distanceToSquared(_this.object.position) > EPS) {
        //     _this.dispatchEvent(changeEvent);

        //     lastPosition.copy(_this.object.position);
        // }
        return { lookat: _this.target, pos: _pos, up: _up };
    };

    this.switchControls = function(c) {
        switch (c) {
            case "orbit":
                _this.type = "orbit";
                _this.rotateCamera = _this.rotateOrbit;
                _this.object.up.set(0, 1, 0);
                break;
            default:
                _this.type = "trackball";
                _this.rotateCamera = _this.rotateTrackball;
                break;
		}
		// _this.update();
    };

    // listeners

    this.mousedown = function(event) {

        if (_state === STATE.NONE) {
            _state = event.button;
        }

        if (_state === STATE.ROTATE && !_this.noRotate) {
            _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
            _movePrev.copy(_moveCurr);
        } else if (_state === STATE.ZOOM && !_this.noZoom) {
            _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
            _zoomEnd.copy(_zoomStart);
        } else if (_state === STATE.PAN && !_this.noPan) {
            _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
            _panEnd.copy(_panStart);
        }
    }

    this.mousemove = function(event) {

        if (_state === STATE.ROTATE && !_this.noRotate) {
            _movePrev.copy(_moveCurr);

            _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
        } else if (_state === STATE.ZOOM && !_this.noZoom) {
            _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
        } else if (_state === STATE.PAN && !_this.noPan) {
            _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
        }
    }

    this.mouseup = function(event) {
        _state = STATE.NONE;
    };

    this.mousewheel = function(event) {
        switch (event.deltaMode) {
            case 2:
                // Zoom in pages
                _zoomStart.y -= event.deltaY * 0.025;
                break;

            case 1:
                // Zoom in lines
                _zoomStart.y -= event.deltaY * 0.01;
                break;

            default:
                // undefined, 0, assume pixels
                _zoomStart.y -= event.deltaY * 0.00025;
                break;
        }
    }

    this.touchstart = function(event) {

        switch (event.touches.length) {
            case 1:
                _state = STATE.TOUCH_ROTATE;
                _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                _movePrev.copy(_moveCurr);
                break;

            default:
                // 2 or more
                _state = STATE.TOUCH_ZOOM_PAN;
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

                var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                _panStart.copy(getMouseOnScreen(x, y));
                _panEnd.copy(_panStart);
                break;
        }

        // _this.dispatchEvent(startEvent);
    };

    this.touchmove = function(event) {

        switch (event.touches.length) {
            case 1:
                _movePrev.copy(_moveCurr);
                _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                break;

            default:
                // 2 or more
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

                var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                _panEnd.copy(getMouseOnScreen(x, y));
                break;
        }
        // _this.update();
    };

    this.touchend = function(event) {
        // if (_this.enabled === false) return;

        switch (event.touches.length) {
            case 0:
                _state = STATE.NONE;
                break;

            case 1:
                _state = STATE.TOUCH_ROTATE;
                _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                _movePrev.copy(_moveCurr);
                break;
        }

        // _this.dispatchEvent(endEvent);
    };


    // this.handleResize();

    // force an update at start
    // this.update();
};

TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
TrackballControls.prototype.constructor = TrackballControls;

export { TrackballControls };
