import getGlobalObject from 'complay/helpers/environment/get-global-object';
import extend from 'complay/helpers/object/extend';
import Module from 'complay/lib/module';
import Model from 'complay/lib/model';
import Service from 'complay/lib/service';
import Component from 'complay/lib/component';
import ApplicationFacade from 'complay/lib/application-facade';
import ApplicationDomComponent from 'complay/lib/application-dom-component';
import Plite from 'plite';

let root = getGlobalObject();
let Complay = root.Complay || {};

// shim promises
!root.Promise && (root.Promise = Plite);
// export ApplicationFacade Class for creating multicore apps
Complay.ApplicationFacade = ApplicationFacade;
Complay.ApplicationFacade.extend = extend;
// export ApplicationDomComponent Class for creating dom views
Complay.ApplicationDomComponent = ApplicationDomComponent;
Complay.ApplicationDomComponent.extend = extend;
// export Module Class
Complay.Module = Module;
Complay.Module.extend = extend;
// export Module Class
Complay.Model = Model;
Complay.Model.extend = extend;
// export Service Class
Complay.Service = Service;
Complay.Service.extend = extend;
// export Component Class
Complay.Component = Component;
Complay.Component.extend = extend;

// replace or create in global namespace
root.Complay = Complay;
