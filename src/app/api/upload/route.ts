import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const oldImagePath = formData.get('oldImagePath') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Delete the old image if it exists
    if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
      try {
        const oldPath = path.join(process.cwd(), 'public', oldImagePath);
        await fs.unlink(oldPath);
      } catch (error) {
        console.error(`Failed to delete old image: ${oldImagePath}`, error);
        // Don't block the upload if deletion fails, just log it
      }
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Create a new file name and path
    const fileExtension = path.extname(file.name || '');
    const newFileName = `${Date.now()}${fileExtension}`;
    const newFilePath = path.join(uploadsDir, newFileName);

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(newFilePath, buffer);

    // Return the public path to the new file
    const publicPath = `/uploads/${newFileName}`;

    return NextResponse.json({ filePath: publicPath }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
