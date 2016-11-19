(function() {
  function createChannel() {
    let channel = {};

    channel.init = function(config) {
      // nothing yet
    };

    channel.connect = function(calling) {
      connect(calling);
    };

    // consider using revealing module pattern
    return channel;
  };

  let channel = createChannel();

  // use a traditional constructor function
  // to use same prototype object, save memory
  window.Channel = function(config) {
    let obj = Object.create(channel);
    obj.init(config);
    return obj;
  };
}());
