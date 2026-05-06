import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Upload, X, Image, CloudUpload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { SUBJECTS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../utils/constants';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';

const schema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100, 'Max 100 characters'),
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().max(500, 'Max 500 characters').optional(),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    rotationDuration: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : 30))
      .refine((v) => v >= 5 && v <= 300, 'Must be between 5 and 300 seconds'),
  })
  .refine((d) => new Date(d.endTime) > new Date(d.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

export default function UploadContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const validateFile = (f) => {
    if (!ALLOWED_FILE_TYPES.includes(f.type)) {
      return 'Only JPG, PNG, and GIF files are allowed.';
    }
    if (f.size > MAX_FILE_SIZE) {
      return 'File size must be under 10MB.';
    }
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) {
      setFileError(err);
      setFile(null);
      setPreview(null);
      return;
    }
    setFileError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data) => {
    if (!file) {
      setFileError('Please upload a file.');
      return;
    }
    setUploading(true);
    try {
      await contentService.uploadContent(user.id, user.name, { ...data, file });
      toast.success('Content uploaded successfully! Awaiting approval.');
      reset();
      removeFile();
      navigate('/teacher/my-content');
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Upload className="h-6 w-6 text-indigo-600" />
            Upload Content
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Upload educational content for approval</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* File Upload */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-700 mb-4">File Upload</h2>

            {!preview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  dragging
                    ? 'border-indigo-400 bg-indigo-50'
                    : fileError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                }`}
              >
                <CloudUpload className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF · Max 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-56 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Image className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{file?.name}</span>
                  <span className="text-gray-400 shrink-0">({(file?.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              </div>
            )}
            {fileError && <p className="text-red-500 text-xs mt-2">{fileError}</p>}
          </div>

          {/* Content Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">Content Details</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Introduction to Algebra"
                {...register('title')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                {...register('subject')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select a subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of the content..."
                {...register('description')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-700">Scheduling</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register('startTime')}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.startTime ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register('endTime')}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.endTime ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation Duration (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                defaultValue="30"
                placeholder="30"
                {...register('rotationDuration')}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.rotationDuration ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-400 mt-1">How long each slide displays (5–300 seconds)</p>
              {errors.rotationDuration && <p className="text-red-500 text-xs mt-1">{errors.rotationDuration.message}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/my-content')}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={uploading} className="flex-1">
              <Upload className="h-4 w-4" />
              Upload Content
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
