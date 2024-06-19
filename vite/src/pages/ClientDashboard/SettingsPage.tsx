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

  const [marker, setMarker] = useState({ lat: null, lng: null });

  const [pricing, setPricing] = useState({
    serviceCost: 0,
    a4Cost: 0,
    a4ColorCost: 0,
    a3Cost: 0,
    a3ColorCost: 0,
  });

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
      const response = await axios.get(`http://localhost:3000/shop/`, {
        withCredentials: true,
      });
      console.log(response.data);
      setShopName(response.data.shop_name);
      setLatLng({ lat: response.data.lat, lng: response.data.lng });
      setMarker({ lat: response.data.lat, lng: response.data.lng });
    };

    fetchShopData();
  }, []);

  const handleLocationSave = () => {
    setLatLng(marker);
  };

  const handlePricingSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/shop/price/`,
        pricing,
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

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/admin/shop/`, // may not work
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
      <h1 className="text-2xl font-semibold mb-5">Settings</h1>
      <h3 className="font-semibold text-xl">Basic Information</h3>
      <div className="mt-3">
        <Label htmlFor="shopName">Shop Name</Label>
        <Input
          id="shopName"
          className="mt-2"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <Label htmlFor="shopName">Shop Location</Label>

        {!latLng.lat && !latLng.lng ? (
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={askLocationPermission}
                  className="mt-2"
                >
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

      <Button onClick={handleSave} className="mt-5">
        Save
      </Button>

      <div className="mt-10">
        <h3 className="font-semibold text-xl">Pricing information</h3>

        <div className="mt-3">
          <Label htmlFor="serviceCost">Service Cost</Label>
          <Input
            id="serviceCost"
            type="number"
            className="mt-2"
            value={pricing.serviceCost}
            onChange={(e) =>
              setPricing({ ...pricing, serviceCost: Number(e.target.value) })
            }
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="a4Cost">A4 cost</Label>
          <Input
            id="a4Cost"
            type="number"
            className="mt-2"
            value={pricing.a4Cost}
            onChange={(e) =>
              setPricing({ ...pricing, a4Cost: Number(e.target.value) })
            }
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="a4ColorCost">A4 cost(color)</Label>
          <Input
            id="a4ColorCost"
            type="number"
            className="mt-2"
            value={pricing.a4ColorCost}
            onChange={(e) =>
              setPricing({ ...pricing, a4ColorCost: Number(e.target.value) })
            }
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="a3Cost">A3 cost</Label>
          <Input
            id="a3Cost"
            type="number"
            className="mt-2"
            value={pricing.a3Cost}
            onChange={(e) =>
              setPricing({ ...pricing, a3Cost: Number(e.target.value) })
            }
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="a3ColorCost">A3 cost(color)</Label>
          <Input
            id="a3ColorCost"
            type="number"
            className="mt-2"
            value={pricing.a3ColorCost}
            onChange={(e) =>
              setPricing({ ...pricing, a3ColorCost: Number(e.target.value) })
            }
          />
        </div>

        <Button onClick={handlePricingSave} className="mt-4">
          Save
        </Button>
      </div>

      <Toaster />
    </div>
  );
}
