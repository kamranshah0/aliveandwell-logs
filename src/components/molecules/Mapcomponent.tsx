import GoogleMapReact, { type Coords } from "google-map-react";
import { cn } from "@/lib/utils";

interface AnyReactComponentProps {
  lat: number;
  lng: number;
  text: string;
}

const AnyReactComponent: React.FC<AnyReactComponentProps> = ({ text }) => (
  <div>{text}</div>
);

interface SimpleMapProps {
  className?: string;
}

export default function SimpleMap({ className }: SimpleMapProps) {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div className={cn("h-[202px] w-full", className)}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center as Coords}
        defaultZoom={defaultProps.zoom}
        options={{
          clickableIcons: false, // icons clickable na hon
          keyboardShortcuts: false, // keyboard shortcuts disable
          fullscreenControl: false, // fullscreen button hata do
          zoomControl: false, // left side zoom + - joystick hata do
          streetViewControl: false, // street view option hata do
          mapTypeControl: false, // satellite/terrain switch hata do
        }}
      >
        <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
}
