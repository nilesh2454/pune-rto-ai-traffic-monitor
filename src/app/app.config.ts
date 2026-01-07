import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, Shield, MapPin, Car, AlertTriangle, IndianRupee, Download, Share2, FileText, ChevronDown, ChevronUp, CheckCircle, XCircle, Camera, Video, StopCircle, Play, Bike, Gauge, User, Phone, Mail, Smartphone, Send, Clock } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Shield,
        MapPin,
        Car,
        AlertTriangle,
        IndianRupee,
        Download,
        Share2,
        FileText,
        ChevronDown,
        ChevronUp,
        CheckCircle,
        XCircle,
        Camera,
        Video,
        StopCircle,
        Play,
        Bike,
        Gauge,
        User,
        Phone,
        Mail,
        Smartphone,
        Send,
        Clock
      })
    )
  ]
};
