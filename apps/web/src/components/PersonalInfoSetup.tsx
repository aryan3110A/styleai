import React, { useState } from "react";
import { ensureUserId, saveProfile, uploadProfilePhoto } from "../services/api";
import { getSavedEmail } from "../services/auth";
import { User, Ruler, Users, UserCircle, Palette, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { UserProfile } from "../App";

interface PersonalInfoSetupProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export function PersonalInfoSetup({
  onComplete,
  initialProfile,
}: PersonalInfoSetupProps) {
  const [formData, setFormData] = useState<UserProfile>(
    initialProfile || {
      name: "",
      age: "",
      height: "",
      gender: "",
      bodyType: "",
      skinTone: "",
      favouriteColours: [],
      region: "",
      photo: undefined,
    }
  );

  // Text input helper for comma-separated favourite colours
  const [favColoursText, setFavColoursText] = useState<string>(
    (initialProfile?.favouriteColours || []).join(", ")
  );

  const [photoPreview, setPhotoPreview] = useState<string>(
    initialProfile?.photo || ""
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData({ ...formData, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.age ||
      !formData.height ||
      !formData.gender ||
      !formData.bodyType ||
      !formData.skinTone
    )
      return;
    const userId = ensureUserId();
    let photoUrl: string | undefined = undefined;
    if (formData.photo && formData.photo.startsWith("data:")) {
      try {
        const up = await uploadProfilePhoto(userId, formData.photo);
        photoUrl = (up as any).url || (up as any).profile?.imageUrl;
      } catch {}
    }
    const payload = {
      userId,
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      heightRange: formData.height,
      bodyType: formData.bodyType,
      skinTone: formData.skinTone,
      imageUrl: photoUrl,
      email: getSavedEmail(),
      region: formData.region || undefined,
      favouriteColours:
        favColoursText.trim().length > 0
          ? favColoursText
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c.length > 0)
          : undefined,
    } as any;
    try {
      await saveProfile(payload);
    } catch {}
    const savedFav = payload.favouriteColours || [];
    onComplete({
      ...formData,
      favouriteColours: savedFav,
      region: payload.region,
      photo: photoUrl || formData.photo,
    });
  };

  const isFormValid =
    formData.name &&
    formData.age &&
    formData.height &&
    formData.gender &&
    formData.bodyType &&
    formData.skinTone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-amber-800 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-3 text-slate-900">
            {initialProfile
              ? "Edit Your Profile"
              : "Let's Personalize Your Experience"}
          </h1>
          <p className="text-slate-600 text-lg">
            {initialProfile
              ? "Update your information to keep your style recommendations accurate"
              : "Help us understand you better to provide personalized fashion advice"}
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <Label htmlFor="photo" className="flex items-center gap-2 mb-3">
                <Upload className="w-4 h-4" />
                Profile Photo (Optional)
              </Label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center border-4 border-stone-200">
                    <UserCircle className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                <label htmlFor="photo" className="cursor-pointer">
                  <div className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                    Upload Photo
                  </div>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Age */}
            <div>
              <Label htmlFor="age" className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>

            {/* Height */}
            <div>
              <Label htmlFor="height" className="flex items-center gap-2 mb-3">
                <Ruler className="w-4 h-4" />
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter your height in cm"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                required
              />
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender" className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" />
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-Binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Body Type */}
            <div>
              <Label
                htmlFor="bodyType"
                className="flex items-center gap-2 mb-3"
              >
                <UserCircle className="w-4 h-4" />
                Body Type
              </Label>
              <Select
                value={formData.bodyType}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, bodyType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="curvy">Curvy</SelectItem>
                  <SelectItem value="plus-size">Plus Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skin Tone */}
            <div>
              <Label
                htmlFor="skinTone"
                className="flex items-center gap-2 mb-3"
              >
                <Palette className="w-4 h-4" />
                Skin Tone
              </Label>
              <Select
                value={formData.skinTone}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, skinTone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your skin tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="olive">Olive</SelectItem>
                  <SelectItem value="tan">Tan</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Favourite Colours */}
            <div>
              <Label
                htmlFor="favColors"
                className="flex items-center gap-2 mb-3"
              >
                <Palette className="w-4 h-4" />
                Favourite Colours (comma separated)
              </Label>
              <Input
                id="favColors"
                type="text"
                placeholder="e.g. blue, black, white"
                value={favColoursText}
                onChange={(e) => setFavColoursText(e.target.value)}
              />
            </div>

            {/* Region (Zone) */}
            <div>
              <Label htmlFor="region" className="flex items-center gap-2 mb-3">
                Region / Zone
              </Label>
              <Select
                value={formData.region || ""}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, region: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North India">North India</SelectItem>
                  <SelectItem value="South India">South India</SelectItem>
                  <SelectItem value="East India">East India</SelectItem>
                  <SelectItem value="Central India">Central India</SelectItem>
                  <SelectItem value="West India">West India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-900 via-rose-900 to-amber-900 hover:opacity-90 py-6"
              disabled={!isFormValid}
            >
              {initialProfile ? "Save Changes" : "Complete Setup"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
