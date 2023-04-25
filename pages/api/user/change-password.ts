// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { hashPassword, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({
        message: "Not Authenticated."
    });
    return;
  } 

  const userEmail = session?.user?.email;

  const oldPassword = req.body.oldPassword;

  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const userDoc = await usersCollection.findOne({ email: userEmail });

  if (!userDoc) {
    res.status(404).json({
        message: "User not found."
    });
    client.close();
    return;
  }

  const currentPassword = userDoc.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({
        message: "Authenticated but not authorized for this operation."
    });
    client.close();  
    return;
  }

  const hashedNewPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne({
      email: userEmail
  }, { $set: { password: hashedNewPassword}});

  client.close();

  return res.json({
      message: "Password updated."
  });
}
