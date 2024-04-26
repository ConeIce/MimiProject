import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

import Map from "../../components/Map";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function SettingsPage() {
  const { toast } = useToast();

  const [shopName, setShopName] = useState("");
  const [latLng, setLatLng] = useState({ lat: null, lng: null });

  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });

  const [marker, setMarker] = useState(null);

  const askLocationPermission = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    const fetchShopData = async () => {
      const response = await axios.get(`http://localhost:3000/admin/shop/`, {
        withCredentials: true,
      });
      setShopName(response.data.shop_name);
      setLatLng({ lat: response.data.lat, lng: response.data.lng });
      setMarker({ lat: response.data.lat, lng: response.data.lng });
    };

    fetchShopData();
  }, []);

  const handleLocationSave = () => {
    setLatLng(marker);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/admin/shop/`,
        {
          shopName: shopName,
          lat: latLng.lat,
          lng: latLng.lng,
        },
        {
          withCredentials: true,
        }
      );

      toast({
        title: "Updated successfully",
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast({
            title: "Oops. Error 400.",
            description: error.response.data,
          });
        } else if (error.response.status === 500) {
          toast({
            title: "Oops. Error 500. Not your fault",
            description: error.response.data,
          });
        } else {
          toast({
            title: `Oops. Error ${error.response.status}`,
            description: error.response.data,
          });
        }
      }
    }
  };

  return (
    <div className="p-10 px-16 w-full">
      <h1>Settings</h1>
      <p>Add or modify your shop settings</p>
      <div className="mt-3">
        <Label htmlFor="shopName">Shop Name</Label>
        <Input
          id="shopName"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <Label htmlFor="shopName">Shop Location</Label>

        {!latLng.lat && !latLng.lng ? (
          <div>
            Add shop location to get users locate your shop{" "}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={askLocationPermission}>
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add location</DialogTitle>
                  <DialogDescription>
                    Add your location and hit save
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Map
                    userLocation={userLocation}
                    marker={marker}
                    setMarker={setMarker}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleLocationSave}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Map marker={marker} setMarker={setMarker} />
        )}
      </div>

      <Button onClick={handleSave}>Save</Button>
      <Toaster />
    </div>
  );
}
