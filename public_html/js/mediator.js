/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Mediator()
{
 var channels = {};
 function publish(channel)
 {
  if (!channels[channel]) return false;
  var args = Array.prototype.slice.call(arguments, 1);
  for (var index in channels[channel])
  {
   var subscription = channels[channel][index];
   subscription.fn.apply(subscription.context, args);
  }
  return this;
 }
 function subscribe(channel, fn)
 {
  if (!channels[channel]) channels[channel] = [];
  channels[channel].push({context: this, fn: fn});
  return this;
 }
 function unsubscribe(channel)
 {
  if (!channels[channel]) return this;
  for (var index in channels[channel])
  {
   if (channels[channel][index].context !== this) continue;
   channels[channel].splice(index, 1);
   return this;
  }
 }
 this.connect = function (object)
 {
  object.subscribe = subscribe;
  object.unsubscribe = unsubscribe;
  object.publish = publish;
 };
 this.disconnect = function (object)
 {
  object.subscribe = undefined;
  object.publish = undefined;
 };
}
//var mediator = new Mediator();