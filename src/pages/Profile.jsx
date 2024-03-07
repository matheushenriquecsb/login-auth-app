import {
  InfoCircleOutlined,
  MailOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOut,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [image, setImage] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true, error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/users/update/${currentUser.id}`,
        formData
      );
      console.log(res.data);
      dispatch(updateUserSuccess(res));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/signout`);
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover"
          onClick={() => fileRef.current.click()}
          onChange={handleChange}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input />
        <Input
          placeholder="Enter your username"
          defaultValue={currentUser.username}
          type="text"
          id="username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Extra information">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Input
          size="large"
          defaultValue={currentUser.email}
          type="text"
          id="email"
          placeholder="email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
          prefix={<MailOutlined />}
        />

        <Input.Password
          type="text"
          id="password"
          placeholder="input password"
          className="bg-slate-100 rounded-lg p-3"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          onChange={handleChange}
          prefix={<UnlockOutlined />}
        />
        <button className="bg-slate-700 text-white p-3 rounded hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5 mb-5">
        <Button danger>Delete Account</Button>
        <Button danger onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
