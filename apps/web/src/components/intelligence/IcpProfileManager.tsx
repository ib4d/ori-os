
'use client';

import React, { useState } from 'react';
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Badge } from '@ori-os/ui';
import { Plus, Target, Trash2, Edit2, Check } from 'lucide-react';

export function IcpProfileManager() {
    const [profiles, setProfiles] = useState<any[]>([
        { id: '1', name: 'SaaS Decision Makers', criteria: { industry: 'Software', employees: '50-200' } }
    ]);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const handleAddProfile = () => {
        if (!newName) return;
        const newProfile = {
            id: Math.random().toString(),
            name: newName,
            criteria: { industry: 'Any', employees: 'Any' }
        };
        setProfiles([...profiles, newProfile]);
        setNewName('');
        setIsCreating(false);
    };

    const removeProfile = (id: string) => {
        setProfiles(profiles.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Your ICP Profiles</h3>
                    <p className="text-sm text-muted-foreground">Define your target audience to improve AI search results.</p>
                </div>
                <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Profile
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary/20 bg-primary/5 border-dashed">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Create New ICP Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Profile Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Mid-Market E-commerce"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddProfile()}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Industry</Label>
                                <Input placeholder="Software, Healthcare..." disabled />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Company Size</Label>
                                <Input placeholder="50-500..." disabled />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleAddProfile}>Save Profile</Button>
                    </CardFooter>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                {profiles.map((profile) => (
                    <Card key={profile.id} className="relative group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center justify-between">
                                <span className="flex items-center">
                                    <Target className="mr-2 h-4 w-4 text-primary" />
                                    {profile.name}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeProfile(profile.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <Badge variant="outline">{profile.criteria.industry}</Badge>
                                <Badge variant="outline">{profile.criteria.employees} employees</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t text-[10px] text-muted-foreground flex justify-between items-center">
                            <span>Created 2 days ago</span>
                            <span className="flex items-center text-primary cursor-pointer hover:underline">
                                <Edit2 className="mr-1 h-3 w-3" />
                                Edit
                            </span>
                        </CardFooter>
                    </Card>
                ))}
                {profiles.length === 0 && !isCreating && (
                    <div className="col-span-full py-10 text-center border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
                        No profiles defined. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
