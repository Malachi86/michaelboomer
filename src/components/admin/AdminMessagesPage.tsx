'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Trash2, Mail, MailOpen, User, Clock, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getMessages, updateMessage, deleteMessage } from '@/app/admin/actions';
import type { Message } from '@/lib/types';
import { format } from 'date-fns';

export function AdminMessagesPage() {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const fetchMessages = async () => {
        setIsLoading(true);
        const fetchedMessages = await getMessages();
        setMessages(fetchedMessages);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleOpenMessage = async (message: Message) => {
        setSelectedMessage(message);
        if (!message.read) {
            await updateMessage(message.id, { read: true });
            fetchMessages();
        }
    };

    const handleDelete = async (id: string) => {
        await deleteMessage(id);
        fetchMessages();
        setSelectedMessage(null);
        toast({ title: "Success", description: "Message deleted." });
    };

    const unreadCount = messages.filter(m => !m.read).length;

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                    >
                    Messages
                    </motion.h1>
                    <p className="text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
            </div>

            {messages.length === 0 ? (
                <Card className="bg-card border-border/50">
                    <CardContent className="py-20 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-muted-foreground/50 text-sm mt-2">Messages from your contact form will appear here</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        >
                        <Card 
                            className={`bg-card border-border/50 cursor-pointer transition-all hover:border-primary/30 ${
                            !message.read ? 'border-l-4 border-l-primary' : ''
                            }`}
                            onClick={() => handleOpenMessage(message)}
                        >
                            <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                message.read ? 'bg-muted' : 'bg-primary/20'
                                }`}>
                                {message.read ? (
                                    <MailOpen className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                    <Mail className="w-5 h-5 text-primary" />
                                )}
                                </div>
                                <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className={`font-medium ${message.read ? 'text-muted-foreground' : 'text-white'}`}>
                                    {message.name}
                                    </h3>
                                    {!message.read && (
                                    <Badge className="bg-primary/20 text-primary border-0 text-xs">New</Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm mb-2">{message.email}</p>
                                <p className="text-muted-foreground line-clamp-2">{message.message}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                <p className="text-muted-foreground text-sm">
                                    {message.createdAt && format(new Date(message.createdAt), 'MMM d, yyyy')}
                                </p>
                                <p className="text-muted-foreground/50 text-xs">
                                    {message.createdAt && format(new Date(message.createdAt), 'h:mm a')}
                                </p>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            )}

            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="bg-card border-border/50 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Message Details</DialogTitle>
                </DialogHeader>
                {selectedMessage && (
                    <div className="space-y-6 py-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                        <h3 className="text-white font-bold text-lg">{selectedMessage.name}</h3>
                        <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                            {selectedMessage.email}
                        </a>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        {selectedMessage.createdAt && format(new Date(selectedMessage.createdAt), 'MMMM d, yyyy at h:mm a')}
                    </div>

                    <div className="bg-muted/30 border border-white/5 rounded-xl p-6">
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button
                        variant="outline"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(selectedMessage.id)}
                        >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                        </Button>
                        <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        asChild
                        >
                        <a href={`mailto:${selectedMessage.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Reply
                        </a>
                        </Button>
                    </div>
                    </div>
                )}
                </DialogContent>
            </Dialog>
        </>
    );
}
